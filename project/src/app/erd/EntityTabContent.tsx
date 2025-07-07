import { Entity, EntityType } from "@/types/erd";

type EntityColor = {
    [key in EntityType ]: string;
};

const colorOptions: EntityColor = {
    "table": "bg-red-100",
    "page": "bg-orange-100",
    "plugin": "bg-green-100",
};

type EntityTabContentProps = {
    entityType: EntityType;
    entities: Entity[];
};

const EntityTabContent: React.FC<EntityTabContentProps> = ({
    entityType,
    entities,
}) => {
    const entityGroupMap = Map.groupBy(entities, ({ data }) => data.groupName);

    const handleDragStart = (event: React.DragEvent, entityId: string) => {
        event.dataTransfer.setData("application/reactflow", entityId);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <div className="flex flex-col w-64 p-2 border-r border-gray-200">
            <div className="flex">
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
                {Array.from(entityGroupMap.entries()).map(([groupName, entities]) => (
                    <details
                        key={groupName}
                        className="
                            cursor-pointer font-semibold rounded-lg shadow-md
                        "
                        open
                    >
                        <summary className={`${colorOptions[entityType]} rounded-t-lg p-1`}>
                            <span>{groupName}</span>
                        </summary>
                        {entities.map((node) => (
                            <div key={node.id}>
                                <div
                                    className="
                                        cursor-grab border-b border-gray-200 p-1
                                        hover:bg-gray-200 transition
                                    "
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, node.id)}
                                >
                                    {node.data.name}
                                </div>
                            </div>
                        ))}
                    </details>
                ))}
            </div>
        </div>
    );
};

export default EntityTabContent;