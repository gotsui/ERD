import { Attribute } from "@/types/erd";
import { Handle, Position } from "@xyflow/react";

type EntityNodeProps = {
    name: string;
    attributes: Attribute[];
    color: string;
    handleColor: string;
};

const EntityNode: React.FC<EntityNodeProps> = ({
    name,
    attributes,
    color,
    handleColor,
}) => {
    return (
        <div className={`border-2 ${color} rounded-md py-4 w-64 shadow-md`}>
            <div className="text-lg font-bold mb-2 border-b border-gray-300 pb-1 px-4">
                {name}
            </div>
            <div className="space-y-2">
                {attributes.map((attribute) => (
                    <div key={attribute.id} className="flex items-center justify-between relative py-1">
                        <div className="px-4">
                            {attribute.name}
                        </div>
                        <Handle
                            type="source"
                            position={Position.Right}
                            id={attribute.id}
                            className={`!w-2 !h-3 ${handleColor}`}
                        />
                        <Handle
                            type="target"
                            position={Position.Left}
                            id={attribute.id}
                            className={`!w-2 !h-3 ${handleColor}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EntityNode;