import React from "react";
import { Node, NodeProps } from "@xyflow/react";
import { Attribute } from "@/types/erd";
import EntityNode from "./EntityNode";

type PageNodeProps = Node<
    {
        name: string;
        attributes: Attribute[];
    }
>;

const PageNode: React.FC<NodeProps<PageNodeProps>> = ({ id, data }) => {
    return (
        <EntityNode
            name={data.name}
            attributes={data.attributes}
            color="border-orange-500 bg-orange-50"
            handleColor="!bg-orange-500"
        />
    );
};

export default PageNode;