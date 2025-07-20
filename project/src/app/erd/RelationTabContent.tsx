import { useMemo } from "react";
import { Entity, Relation } from "@/types/erd";

type RelationHandle = {
    groupName: string;
    entityName: string;
    attributeName: string;
};

type RelationHandlePair = {
    id: string;
    source: RelationHandle;
    target: RelationHandle;
};

type RelationTabContentProps = {
    entities: Entity[];
    addedRelations: Relation[];
    onClickSave: () => void;
};

const RelationTabContent: React.FC<RelationTabContentProps> = ({
    entities,
    addedRelations,
    onClickSave,
}) => {
    const attributeIdMap = useMemo(() => {
        const handleMap = new Map<string, RelationHandle>();
        entities.forEach((entity) => {
            entity.data.attributes.forEach((attribute) => {
                handleMap.set(attribute.id, {
                    groupName: entity.data.groupName,
                    entityName: entity.data.name,
                    attributeName: attribute.name,
                });
            })
        });
        return handleMap;
    }, [entities]);

    const relationHandlePairs = useMemo(() => {
        const pairs: (RelationHandlePair | undefined)[] = addedRelations.map((relation) => {
            const source = attributeIdMap.get(relation.sourceHandle);
            const target = attributeIdMap.get(relation.targetHandle);

            if (!source || !target) {
                return;
            }

            return {
                id: relation.id,
                source,
                target,
            };
        });

        const filtered = pairs.filter((pair): pair is Exclude<typeof pair, undefined> => pair !== undefined);

        return filtered;
    }, [addedRelations, attributeIdMap]);

    return (
        <div className="flex flex-col w-64 px-2 border-r border-gray-200">
            <div>追加されたリレーション</div>
            <button
                type="button"
                className="px-4 py2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={onClickSave}
            >
                保存
            </button>
            <div className="space-y-4 mt-4">
                {relationHandlePairs.map((pair) => (
                    <div key={pair.id} className="bg-blue-200 p-2 rounded-2xl">
                        <div className="flex flex-col bg-blue-100 p-2 rounded-2xl">
                            <span className="font-medium text-sm">{pair.source.groupName}</span>
                            <span className="font-medium text-sm">{pair.source.entityName}</span>
                            <span className="font-medium text-sm">{pair.source.attributeName}</span>
                        </div>
                        <div className="text-center">|</div>
                        <div className="flex flex-col bg-blue-100 p-2 rounded-2xl">
                            <span className="font-medium text-sm">{pair.target.groupName}</span>
                            <span className="font-medium text-sm">{pair.target.entityName}</span>
                            <span className="font-medium text-sm">{pair.target.attributeName}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelationTabContent;