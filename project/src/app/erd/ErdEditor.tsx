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

const nodeTypes = {
    table: TableNode,
    tool: TableNode,
    plugin: TableNode,
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

        const nextDisplayedNodeIdSet = new Set(
            [...displayedNodes.map((node) => node.id), displayingNode.id]
        );
        const nextDisplayedEdges = relations.filter(
            (edge) => nextDisplayedNodeIdSet.has(edge.source) && nextDisplayedNodeIdSet.has(edge.target)
        );

        setDisplayedNodes((nds) => nds.concat(displayingNode));
        setDisplayedEdges(nextDisplayedEdges);
    }, [screenToFlowPosition, nonDisplayedNodes, setDisplayedNodes, setDisplayedEdges]);

    const handleDragStart = (event: React.DragEvent, entityId: string) => {
        event.dataTransfer.setData("application/reactflow", entityId);
        event.dataTransfer.effectAllowed = "move";
    };

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
                        <div className="flex flex-col w-64 px-2 border-r border-gray-200">
                            <div>
                                <input
                                    type="text"
                                    className="
                                        bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                                    "
                                    placeholder="フィルター"
                                />
                            </div>
                            <div className="flex flex-col gap-2 mt-2">
                                {nonDisplayedNodes.map((node) => (
                                    <div key={node.id}>
                                        <div
                                            className="
                                                p-3 bg-gray-100 rounded-md cursor-grab
                                                hover:bg-gray-200 transition
                                            "
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, node.id)}
                                        >
                                            {node.data.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel id="page">
                        page
                    </TabPanel>
                    <TabPanel id="plugin">
                        plugin
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