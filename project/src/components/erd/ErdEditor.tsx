import React, { useCallback, useEffect, useRef, useState } from "react";
import TableNode from "./TableNode";
import { addEdge, Background, Connection, Controls, ReactFlow, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { Entity, Relation } from "@/types/erd";
import SideTab, { SideTabType } from "./SideTab";
import SideBar from "./SideBar";

const nodeTypes = {
    table: TableNode,
    tool: TableNode,
    plugin: TableNode,
};

const ErdEditor: React.FC = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState<Entity>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Relation>([]);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedTableIds, setSelectedTableIds] = useState<Set<string>>(new Set());
    const { screenToFlowPosition } = useReactFlow();
    const [selectedTab, setSelectedTab] = useState<SideTabType>("table");

    useEffect(() => {
        const initialNodes: Entity[] = [
            {
                id: "1",
                type: "table",
                position: { x: 100, y: 100 },
                data: {
                    name: "tbl1",
                    attributes: [{
                        id: "1",
                        name: "col1",
                        type: "varchar"
                    }],
                },
            },
            {
                id: "2",
                type: "table",
                position: { x: 500, y: 100 },
                data: {
                    name: "tbl2",
                    attributes: [{
                        id: "1",
                        name: "col1",
                        type: "varchar"
                    }],
                },
            },
        ];

        setNodes(initialNodes);
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

    const handleTabClick = (tabName: SideTabType) => {
        setSelectedTab(tabName);
    };

    return (
        <div className="h-screen w-screen flex flex-col select-none overflow-x-hidden">
            <div className="flex w-full h-full min-h-0">
                <SideTab onTabClick={handleTabClick} />
                <SideBar
                    nodes={nodes}
                    edges={edges}
                    selectedTab={selectedTab}
                />
                <div className="flex-1" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                    >
                        <Controls />
                        <Background />
                    </ReactFlow>
                </div>
            </div>
        </div>
    )
};

export default ErdEditor;