"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { addEdge, Background, Connection, Controls, ReactFlow, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { Entity, Relation } from "@/types/erd";
import TableNode from "@/components/erd/TableNode";
import Tab from "@/components/sidetabs/Tab";
import TabGroup from "@/components/sidetabs/TabGroup";
import TabList from "@/components/sidetabs/TabList";
import TabPanel from "@/components/sidetabs/TabPanel";

const nodeTypes = {
    table: TableNode,
    tool: TableNode,
    plugin: TableNode,
};

const Consumer: React.FC = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState<Entity>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Relation>([]);
    const { screenToFlowPosition } = useReactFlow();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/erd");

                if (!response.ok) {
                    throw new Error("Failed to fetch entity");
                }

                const { nodes: initialNodes, edges: initialEdges } = await response.json();
                setNodes(initialNodes);
                setEdges(initialEdges);
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

        setEdges((eds) =>
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
    }, [setEdges]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    return (
        <div className="h-screen w-screen flex flex-col select-none overflow-x-hidden">
            <div className="flex w-full h-full min-h-0">
                <TabGroup defaultTab="table">
                    <TabList>
                        <Tab id="table">テーブル</Tab>
                        <Tab id="page">画面</Tab>
                        <Tab id="plugin">プラグイン</Tab>
                        <Tab id="relation">リレーション</Tab>
                        <Tab id="save">保存</Tab>
                    </TabList>
                    <TabPanel id="table">
                        <div className="px-2">
                            <div>
                                <input
                                    type="text"
                                    id="first_name"
                                    className="
                                        bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                                    "
                                    placeholder="フィルター"
                                />
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
                    <TabPanel id="save">
                        <form className="px-2">
                            <div className="mb-4">
                                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">ER図名</label>
                                <input
                                    type="text"
                                    id="first_name"
                                    className="
                                        bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                                    "
                                />
                            </div>
                            <button
                                type="submit"
                                className="
                                    text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
                                    font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center
                                "
                            >
                                保存
                            </button>
                        </form>
                    </TabPanel>
                </TabGroup>
                <div className="flex-1" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
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

export default Consumer;