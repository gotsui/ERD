import { Attribute } from "@/types/erd";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import React from "react";

type TableNode = Node<
    {
        name: string;
        attributes: Attribute[];
    }
>;

const TableNode: React.FC<NodeProps<TableNode>> = ({ id, data }) => {
    return (
        <div className="border-2 border-pink-500 bg-pink-50 rounded-md py-4 w-64 shadow-md">
            <div className="text-lg font-bold mb-2 border-b border-gray-300 pb-1 px-4">
                {data.name}
            </div>
            <div className="space-y-2">
                {data.attributes.map((attribute) => (
                    <div key={attribute.id} className="flex items-center justify-between relative py-1">
                        <div className="px-4">
                            {attribute.name}
                        </div>
                        <Handle
                            type="source"
                            position={Position.Right}
                            id={attribute.id}
                            className="!w-2 !h-3 !bg-pink-500"
                        />
                        <Handle
                            type="target"
                            position={Position.Left}
                            id={attribute.id}
                            className="!w-2 !h-3 !bg-pink-500"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableNode;