"use client";

import { Entity } from "@/types/erd";
import { useEffect, useState } from "react";

type Erd = {
    id: string;
    name: string;
};

type ErdTabContentProps = {
    displayedNodes: Entity[];
    setDisplayedNodes: (nextNodes: Entity[]) => void;
};

const ErdTabContent: React.FC<ErdTabContentProps> = ({
    displayedNodes,
    setDisplayedNodes,
}) => {
    const [erdName, setErdName] = useState("");

    const handleClickSave = async () => {
        if (!erdName) {
            alert("ER図名を入力してください");
            return;
        }

        if (displayedNodes.length === 0) {
            alert("エンティティがありません");
            return;
        }

        const res = await fetch("/api/erd", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: erdName,
                entities: displayedNodes,
            }),
        });

        if (res.ok) {
            alert("保存しました");
        } else {
            alert("保存に失敗しました");
        }
    };

    return (
        <div className="flex flex-col w-64 px-2 border-r border-gray-200">
            <div className="space-y-4">
                <div>
                    <span>名前を付けて保存</span>
                    <div className="mb-4">
                        <label htmlFor="save-erd" className="block mb-2 text-sm font-medium text-gray-900">ER図名</label>
                        <input
                            type="text"
                            id="save-erd"
                            value={erdName}
                            onChange={(e) => setErdName(e.target.value)}
                            className="
                                bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                            "
                        />
                    </div>
                    <button
                        type="button"
                        className="
                            text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
                            font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center
                        "
                        onClick={handleClickSave}
                    >
                        保存
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErdTabContent;