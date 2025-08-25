"use client";

import { Entity, EntityType } from "@/types/erd";
import { useMemo, useState } from "react";

type AddTabContentProps = {
    entities: Entity[];
    setEntities: (entities: Entity[]) => void;
};

const AddTabContent: React.FC<AddTabContentProps> = ({
    entities,
    setEntities,
}) => {
    const [entityGroupName, setEntityGroupName] = useState("");
    const [entityName, setEntityName] = useState("");
    const [selectedEntityType, setSelectedEntityType] = useState<EntityType>("table");

    const radioButtons: { label: string; value: EntityType; }[] = [
        { label: "テーブル", value: "table" },
        { label: "画面", value: "page" },
        { label: "プラグイン", value: "plugin" },
    ];

    const entityGroupNames = useMemo(() => {
        return [...new Set(entities.map((entity) => entity.data.groupName))].sort();
    }, [entities]);

    const handleClickAdd = async () => {
        if (!entityGroupName || !entityName) {
            alert("未入力欄があります");
            return;
        }

        const response = await fetch("/api/entity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                entityGroupName,
                entityName,
                entityType: selectedEntityType,
            }),
        });

        if (response.ok) {
            alert("保存しました");
            const { entity }: { entity: Entity; } = await response.json();
            setEntities([...entities, entity].sort((a, b) => {
                const groupNameA = a.data.groupName.toUpperCase();
                const groupNameB = b.data.groupName.toUpperCase();

                if (groupNameA < groupNameB) {
                    return -1
                }

                if (groupNameA > groupNameB) {
                    return 1;
                }

                const nameA = a.data.name.toUpperCase();
                const nameB = b.data.name.toUpperCase();

                if (nameA < nameB) {
                    return -1;
                }

                if (nameA > nameB) {
                    return 1;
                }

                return 0;
            }));
        } else {
            alert("保存に失敗しました");
        }
    };

    return (
        <div className="flex flex-col w-64 px-2 border-r border-gray-200">
            <div className="mt-2">
                <label htmlFor="entity-group" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">グループ名</label>
                <input
                    type="text"
                    id="entity-group"
                    className="
                        bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                    "
                    value={entityGroupName}
                    onChange={(e) => setEntityGroupName(e.target.value)}
                    list="entity-group-list"
                    placeholder="Entity Group Name"
                    required
                />
                <datalist id="entity-group-list">
                    {entityGroupNames.map((name) => (
                        <option key={name} value={name}></option>
                    ))}
                </datalist>
            </div>
            <div className="mt-4">
                <label htmlFor="entity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">エンティティ名</label>
                <input
                    type="text"
                    id="entity"
                    className="
                        bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                    "
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                    placeholder="Entity Name"
                    required
                />
            </div>
            <div className="mt-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">タイプ</h3>
                <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {radioButtons.map((btn) => (
                        <li key={btn.value} className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                            <div className="flex items-center ps-3">
                                <input
                                    id={`entity-type-${btn.value}`}
                                    type="radio"
                                    name="entity-type"
                                    value={btn.value}
                                    onChange={() => setSelectedEntityType(btn.value)}
                                    checked={btn.value === selectedEntityType}
                                    className="
                                        w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500
                                        dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600
                                        dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700
                                    "
                                />
                                <label htmlFor={`entity-type-${btn.value}`} className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{btn.label}</label>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-4">
                <button
                    type="button"
                    className="
                        text-white bg-blue-700 hover:bg-blue-800
                        focus:ring-4 focus:ring-blue-300 font-medium
                        rounded-lg text-sm px-5 py-2.5 me-2 mb-2
                        dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800
                    "
                    onClick={handleClickAdd}
                >
                    追加
                </button>
            </div>
        </div>
    );
};

export default AddTabContent;