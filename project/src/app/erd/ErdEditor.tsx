"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { addEdge, Background, Connection, Controls, Node, ReactFlow, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { Entity, Relation } from "@/types/erd";
import TableNode from "@/components/erd/TableNode";
import Tab from "@/components/sidetabs/Tab";
import TabGroup from "@/components/sidetabs/TabGroup";
import TabList from "@/components/sidetabs/TabList";
import TabPanel from "@/components/sidetabs/TabPanel";
import ErdTabContent from "./ErdTabContent";
import EntityTabContent from "./EntityTabContent";
import PageNode from "@/components/erd/PageNode";
import PluginNode from "@/components/erd/PluginNode";
import RelationTabContent from "./RelationTabContent";
import EditTabContent from "./EditTabContent";

const nodeTypes = {
    table: TableNode,
    page: PageNode,
    plugin: PluginNode,
};

const ErdEditor: React.FC = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { screenToFlowPosition } = useReactFlow();
    const [entities, setEntities] = useState<Entity[]>([]);
    const [relations, setRelations] = useState<Relation[]>([]);
    const [displayedNodes, setDisplayedNodes, onDisplayedNodesChange] = useNodesState<Entity>([]);
    const [displayedEdges, setDisplayedEdges, onDisplayedEdgesChange] = useEdgesState<Relation>([]);
    const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

    const nonDisplayedNodes = useMemo(() => {
        const nodeIdSet = new Set(displayedNodes.map((node) => node.id));
        return entities.filter((entity) => !nodeIdSet.has(entity.id));
    }, [entities, displayedNodes]);

    const nonDisplayedEntityMap = Map.groupBy(nonDisplayedNodes, ({ type }) => type);

    const addedRelations = useMemo(() => {
        return displayedEdges.filter((edge) => !relations.some((relation) => relation.id === edge.id));
    }, [relations, displayedEdges]);

    const saveRelations = useCallback(async () => {
        const response = await fetch("/api/relation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                relations: addedRelations,
            }),
        });

        if (response.ok) {
            alert("保存しました");
            const { edges } = await response.json();
            const nextRelations = relations.concat(edges);
            const removed = displayedEdges.filter((edge) => relations.some((relation) => relation.id === edge.id));
            const nextDisplayedEdges = removed.concat(edges);
            setRelations(nextRelations);
            setDisplayedEdges(nextDisplayedEdges);
        } else {
            alert("保存に失敗しました");
            const data = await response.json();
            console.error(data);
            return;
        }
    }, [setRelations, setDisplayedEdges, addedRelations]);

    const updateDisplay = useCallback((nextDisplayedNodes: Entity[]) => {
        const displayedNodeIdSet = new Set(nextDisplayedNodes.map((node) => node.id));
        const nextDisplayedEdges = relations.concat(addedRelations).filter(
            (edge) => displayedNodeIdSet.has(edge.source) && displayedNodeIdSet.has(edge.target)
        );

        setDisplayedNodes(nextDisplayedNodes);
        setDisplayedEdges(nextDisplayedEdges);
    }, [relations, setDisplayedNodes, setDisplayedEdges, addedRelations]);

    const updateEntity = useCallback((entity: Entity) => {
        setEntities((prev) => prev.map(
            (p) => p.id === entity.id ? { ...p, data: { ...p.data, attributes: entity.data.attributes } } : p
        ));
        setDisplayedNodes((prev) => prev.map(
            (node) => node.id === entity.id ? { ...node, data: { ...node.data, attribute: entity.data.attributes } } : node
        ));
        setSelectedEntity(entity);
    }, [setEntities, setDisplayedNodes, setSelectedEntity]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/entity");

                if (!response.ok) {
                    throw new Error("Failed to fetch entity");
                }

                const { nodes: initialNodes, edges: initialEdges } = await response.json();
                setEntities(initialNodes);
                setRelations(initialEdges);
            } catch (error) {
                console.error("Error fetching entities: ", error);
            }
        };

        fetchData();
    }, []);

    const onConnect = useCallback((params: Connection) => {
        if (!params.sourceHandle || !params.targetHandle) {
            return;
        }

        setDisplayedEdges((eds) =>
            addEdge(
                {
                    ...params,
                    id: `edge-${params.sourceHandle}-${params.targetHandle}`,
                    sourceHandle: params.sourceHandle,
                    targetHandle: params.targetHandle,
                    label: "",
                },
                eds
            )
        );
    }, [setDisplayedEdges]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        const entityId = event.dataTransfer.getData("application/reactflow");
        const entity = nonDisplayedNodes.find((node) => node.id === entityId);

        if (!entity) {
            return;
        }

        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        const displayingNode: Entity = { ...entity, position };

        const nextDisplayedNodes = displayedNodes.concat(displayingNode);
        updateDisplay(nextDisplayedNodes);
    }, [screenToFlowPosition, nonDisplayedNodes]);

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        setSelectedEntity(entities.find((entity) => entity.id === node.id) ?? null);
    }, [setSelectedEntity, entities]);

    return (
        <div className="h-screen w-screen flex flex-col select-none overflow-x-hidden">
            <div className="flex w-full h-full min-h-0">
                <TabGroup defaultTab="table">
                    <TabList>
                        <Tab id="table">テーブル</Tab>
                        <Tab id="page">画面</Tab>
                        <Tab id="plugin">プラグイン</Tab>
                        <Tab id="relation">リレーション</Tab>
                        <Tab id="erd">ER図</Tab>
                        <Tab id="edit">エンティティ<br/>編集</Tab>
                    </TabList>
                    <TabPanel id="table">
                        <EntityTabContent
                            entityType="table"
                            entities={nonDisplayedEntityMap.get("table") ?? []}
                        />
                    </TabPanel>
                    <TabPanel id="page">
                        <EntityTabContent
                            entityType="page"
                            entities={nonDisplayedEntityMap.get("page") ?? []}
                        />
                    </TabPanel>
                    <TabPanel id="plugin">
                        <EntityTabContent
                            entityType="plugin"
                            entities={nonDisplayedEntityMap.get("plugin") ?? []}
                        />
                    </TabPanel>
                    <TabPanel id="relation">
                        <RelationTabContent
                            entities={entities}
                            addedRelations={addedRelations}
                            onClickSave={saveRelations}
                        />
                    </TabPanel>
                    <TabPanel id="erd">
                        <ErdTabContent
                            displayedNodes={displayedNodes}
                            setDisplayedNodes={updateDisplay}
                        />
                    </TabPanel>
                    <TabPanel id="edit">
                        <EditTabContent
                            selectedEntity={selectedEntity}
                            updateEntity={updateEntity}
                        />
                    </TabPanel>
                </TabGroup>
                <div className="flex-1" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={displayedNodes}
                        edges={displayedEdges}
                        onNodesChange={onDisplayedNodesChange}
                        onEdgesChange={onDisplayedEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        nodeTypes={nodeTypes}
                    >
                        <Controls />
                        <Background />
                    </ReactFlow>
                </div>
            </div>
        </div>
    );
};

export default ErdEditor;