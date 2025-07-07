import React from "react";
import { Node, NodeProps } from "@xyflow/react";
import { Attribute } from "@/types/erd";
import EntityNode from "./EntityNode";

type PluginNodeProps = Node<
    {
        name: string;
        attributes: Attribute[];
    }
>;

const PluginNode: React.FC<NodeProps<PluginNodeProps>> = ({ id, data }) => {
    return (
        <EntityNode
            name={data.name}
            attributes={data.attributes}
            color="border-green-500 bg-green-50"
            handleColor="!bg-green-500"
        />
    );
};

export default PluginNode;