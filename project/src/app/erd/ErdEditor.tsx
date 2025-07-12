"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { addEdge, Background, Connection, Controls, ReactFlow, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { Entity, Relation } from "@/types/erd";
import TableNode from "@/components/erd/TableNode";
import Tab from "@/components/sidetabs/Tab";
import TabGroup from "@/components/sidetabs/TabGroup";
import TabList from "@/components/sidetabs/TabList";
import TabPanel from "@/components/sidetabs/TabPanel";
import SaveTabContent from "./SaveTabContent";
import EntityTabContent from "./EntityTabContent";
import PageNode from "@/components/erd/PageNode";
import PluginNode from "@/components/erd/PluginNode";

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

    const nonDisplayedNodes = useMemo(() => {
        const nodeIdSet = new Set(displayedNodes.map((node) => node.id));
        return entities.filter((entity) => !nodeIdSet.has(entity.id));
    }, [entities, displayedNodes]);

    const nonDisplayedEntityMap = Map.groupBy(nonDisplayedNodes, ({ type }) => type);

    const addedRelations = useMemo(() => {
        return displayedEdges.filter((edge) => !relations.some((relation) => relation.id === edge.id));
    }, [relations, displayedEdges]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/erd");

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
        const displayedNodeIdSet = new Set(nextDisplayedNodes.map((node) => node.id));
        const nextDisplayedEdges = relations.concat(addedRelations).filter(
            (edge) => displayedNodeIdSet.has(edge.source) && displayedNodeIdSet.has(edge.target)
        );

        setDisplayedNodes(nextDisplayedNodes);
        setDisplayedEdges(nextDisplayedEdges);
    }, [screenToFlowPosition, nonDisplayedNodes, setDisplayedNodes, addedRelations]);

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
                        relation
                    </TabPanel>
                    <TabPanel id="erd">
                        <SaveTabContent />
                    </TabPanel>
                </TabGroup>
                <div className="flex-1" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={displayedNodes}
                        edges={displayedEdges}
                        onNodesChange={onDisplayedNodesChange}
                        onEdgesChange={onDisplayedEdgesChange}
                        onConnect={onConnect}
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