import { Column } from "@/types/erd";
import { Node, NodeProps } from "@xyflow/react";
import React from "react";

type TableNode = Node<
    {
        label: string;
        columns: Column[];
    }
>;

const TableNode: React.FC<NodeProps<TableNode>> = ({ id, data }) => {
    return (
        <>
        </>
    );
};

export default TableNode;