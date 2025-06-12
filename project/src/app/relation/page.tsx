"use client";

import { Attribute, Entity, EntityGroup, Relation } from "@/types/erd";
import { useEffect, useState } from "react";

type relationWithName = Relation & {
    sourceEntityGroupName: string;
    sourceEntityName: string;
    sourceAttributeName: string;
    targetEntityGroupName: string;
    targetEntityName: string;
    targetAttributeName: string;
};

const RelationPage: React.FC = () => {
    const [entityGroups, setEntityGroups] = useState<EntityGroup[]>([]);
    const [sourceEntityGroupId, setSourceEntityGroupId] = useState<string>("");
    const [sourceEntityId, setSourceEntityId] = useState<string>("");
    const [sourceAttributeId, setSourceAttributeId] = useState<string>("");
    const [targetEntityGroupId, setTargetEntityGroupId] = useState<string>("");
    const [targetEntityId, setTargetEntityId] = useState<string>("");
    const [targetAttributeId, setTargetAttributeId] = useState<string>("");
    const [label, setLabel] = useState<string>("");
    const [relations, setRelations] = useState<relationWithName[]>([]);

    const sourceEntityGroup = entityGroups.find((entityGroup) => entityGroup.id === sourceEntityGroupId);
    const sourceEntities = sourceEntityGroup?.entities;
    const sourceEntity = sourceEntities?.find((entity) => entity.id === sourceEntityId);
    const sourceAttributes = sourceEntity?.data.attributes;
    const sourceAttribute = sourceAttributes?.find((attribute) => attribute.id === sourceAttributeId);

    const targetEntityGroup = entityGroups.find((entityGroup) => entityGroup.id === targetEntityGroupId);
    const targetEntities = targetEntityGroup?.entities;
    const targetEntity = targetEntities?.find((entity) => entity.id === targetEntityId);
    const targetAttributes = targetEntity?.data.attributes;
    const targetAttribute = targetAttributes?.find((attribute) => attribute.id === targetAttributeId);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/relation");

                if (!response.ok) {
                    throw new Error("Failed to fetch entity");
                }

                const { entityGroups }: { entityGroups: EntityGroup[] } = await response.json();
                setEntityGroups(entityGroups);
            } catch (error) {
                console.error("Error fetching entities: ", error);
            }
        };

        fetchData();
    }, []);

    const handleClick = () => {
        if (!sourceEntityGroup) return;
        if (!sourceEntity) return;
        if (!sourceAttribute) return;
        if (!targetEntityGroup) return;
        if (!targetEntity) return;
        if (!targetAttribute) return;

        const newRelation: relationWithName = {
            id: `${sourceEntityGroup.id}-${sourceEntityId}-${sourceAttributeId}-${targetEntityGroup.id}-${targetEntityId}-${targetAttributeId}`,
            source: sourceEntityId,
            sourceHandle: sourceAttributeId,
            target: targetEntityId,
            targetHandle: targetAttributeId,
            label: label,
            sourceEntityGroupName: sourceEntityGroup.name,
            sourceEntityName: sourceEntity.data.name,
            sourceAttributeName: sourceAttribute.name,
            targetEntityGroupName: targetEntityGroup.name,
            targetEntityName: targetEntity.data.name,
            targetAttributeName: targetAttribute.name,
        };

        if (relations.find((relation) => relation.id === newRelation.id)) return;

        setRelations([...relations, newRelation]);
    };

    return (
        <div className="h-screen w-screen flex flex-col select-none overflow-x-hidden">
            <div className="flex p-4 mx-auto space-x-4">
                <div className="flex flex-col p-4">
                    <h2 className="text-lg font-bold">リレーション元</h2>
                    <div className="flex space-x-4 mt-4 pl-4">
                        <div className="max-w-sm">
                            <label
                                htmlFor="source-entity-group"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                EntityGroup
                            </label>
                            <select
                                id="source-entity-group"
                                className="
                                    border border-gray-300 bg-gray-50 text-gray-900 text-sm rounded-lg
                                    focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                                "
                                value={sourceEntityGroupId}
                                onChange={(e) => setSourceEntityGroupId(e.target.value)}
                            >
                                <option>選択してください</option>
                                {entityGroups.map((entityGroup) => (
                                    <option key={entityGroup.id} value={entityGroup.id}>{entityGroup.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="max-w-sm">
                            <label
                                htmlFor="source-entity"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Entity
                            </label>
                            <select
                                id="source-entity"
                                className="
                                    border border-gray-300 bg-gray-50 text-gray-900 text-sm rounded-lg
                                    focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                                "
                                value={sourceEntityId}
                                onChange={(e) => setSourceEntityId(e.target.value)}
                            >
                                <option>選択してください</option>
                                {sourceEntities && (
                                    sourceEntities.map((entity) => (
                                        <option key={entity.id} value={entity.id}>{entity.data.name}</option>
                                    )
                                ))}
                            </select>
                        </div>
                        <div className="max-w-sm">
                            <label
                                htmlFor="source-entity"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Entity
                            </label>
                            <select
                                id="source-entity"
                                className="
                                    border border-gray-300 bg-gray-50 text-gray-900 text-sm rounded-lg
                                    focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                                "
                                value={sourceAttributeId}
                                onChange={(e) => setSourceAttributeId(e.target.value)}
                            >
                                <option>選択してください</option>
                                {sourceAttributes && (
                                    sourceAttributes.map((attribute) => (
                                        <option key={attribute.id} value={attribute.id}>{attribute.name}</option>
                                    )
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col p-4 justify-end">
                    <label
                        htmlFor="source-entity-group"
                        className="block mb-2 text-sm font-medium text-gray-900"
                    >
                        ラベル
                    </label>
                    <input
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        className="
                            border border-gray-300 bg-gray-50 text-gray-900 text-sm rounded-lg
                            focus:ring-blue-500 focus:border-blue-500 block p-2.5
                        "
                    />
                </div>
                <div className="flex flex-col p-4">
                    <h2 className="text-lg font-bold">リレーション先</h2>
                    <div className="flex space-x-4 mt-4 pl-4">
                        <div className="max-w-sm">
                            <label
                                htmlFor="target-entity-group"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                EntityGroup
                            </label>
                            <select
                                id="target-entity-group"
                                className="
                                    border border-gray-300 bg-gray-50 text-gray-900 text-sm rounded-lg
                                    focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                                "
                                value={targetEntityGroupId}
                                onChange={(e) => setTargetEntityGroupId(e.target.value)}
                            >
                                <option>選択してください</option>
                                {entityGroups.map((entityGroup) => (
                                    <option key={entityGroup.id} value={entityGroup.id}>{entityGroup.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="max-w-sm">
                            <label
                                htmlFor="target-entity"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Entity
                            </label>
                            <select
                                id="target-entity"
                                className="
                                    border border-gray-300 bg-gray-50 text-gray-900 text-sm rounded-lg
                                    focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                                "
                                value={targetEntityId}
                                onChange={(e) => setTargetEntityId(e.target.value)}
                            >
                                <option>選択してください</option>
                                {targetEntities && (
                                    targetEntities.map((entity) => (
                                        <option key={entity.id} value={entity.id}>{entity.data.name}</option>
                                    )
                                ))}
                            </select>
                        </div>
                        <div className="max-w-sm">
                            <label
                                htmlFor="target-entity"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Entity
                            </label>
                            <select
                                id="target-entity"
                                className="
                                    border border-gray-300 bg-gray-50 text-gray-900 text-sm rounded-lg
                                    focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                                "
                                value={targetAttributeId}
                                onChange={(e) => setTargetAttributeId(e.target.value)}
                            >
                                <option>選択してください</option>
                                {targetAttributes && (
                                    targetAttributes.map((attribute) => (
                                        <option key={attribute.id} value={attribute.id}>{attribute.name}</option>
                                    )
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <button
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                    onClick={handleClick}
                >
                    ⬇
                </button>
            </div>
            <div className="flex flex-1 p-4 mx-auto">
                <div className="flex flex-col p-4">
                    <h2 className="text-lg font-bold">リレーション</h2>
                    <div>
                        {relations.map((relation) => {
                            return (
                                <div key={relation.id}>
                                    {relation.sourceEntityGroupName}.{relation.sourceEntityName}.{relation.sourceAttributeName}
                                    -
                                    {relation.targetEntityGroupName}.{relation.targetEntityName}.{relation.targetAttributeName}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RelationPage;