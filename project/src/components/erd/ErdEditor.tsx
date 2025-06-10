import React, { useEffect, useRef, useState } from "react";
import TableNode from "./TableNode";
import { useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { EREdge, ERNode, ERNodeType } from "@/types/erd";
import SideTab from "./SideTab";
import SideBar from "./SideBar";

const nodeTypes = {
    table: TableNode,
    tool: TableNode,
    plugin: TableNode,
};

const ErdEditor: React.FC = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState<ERNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<EREdge>([]);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedTableIds, setSelectedTableIds] = useState<Set<string>>(new Set());
    const { screenToFlowPosition } = useReactFlow();
    const [selectedTab, setSelectedTab] = useState<ERNodeType | "relation">("table");

    useEffect(() => {
        const initialNodes: ERNode[] = [
            {
                id: "1",
                type: "table",
                position: { x: 100, y: 100 },
                data: {
                    name: "tbl1",
                    columns: [],
                },
            },
            {
                id: "2",
                type: "table",
                position: { x: 100, y: 100 },
                data: {
                    name: "tbl2",
                    columns: [],
                },
            },
        ];

        setNodes(initialNodes);
    }, []);

    const handleTabClick = (tabName: ERNodeType | "relation") => {
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
            </div>
        </div>
    )
};

export default ErdEditor;