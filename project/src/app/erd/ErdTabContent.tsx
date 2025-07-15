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
    const [erds, setErds] = useState<Erd[]>([]);
    const [selectedErdId, setSelectedErdId] = useState("");
    const [loadedErd, setLoadedErd] = useState<Erd | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const nextErds = await requestErdList();
            setErds(nextErds);
        };

        fetchData();
    }, []);

    const requestErdList = async (): Promise<Erd[]> => {
        try {
            const response = await fetch("/api/erd");

            if (!response.ok) {
                throw new Error("Failed to fetch erd");
            }

            const { erds }: { erds: Erd[]; } = await response.json();
            return erds;
        } catch (error) {
            console.error("Error fetching ERD: ", error);
            return [];
        }
    }

    const handleClickLoad = async () => {
        if (!selectedErdId) {
            alert("ER図を選択してください");
            return;
        }

        try {
            const response = await fetch(`/api/erd/${selectedErdId}`);

            if (!response.ok) {
                throw new Error("Failed to fetch erd");
            }

            const { entities }: { entities: Entity[]; } = await response.json();
            setDisplayedNodes(entities);
            setLoadedErd(erds.find((erd) => erd.id === selectedErdId) ?? null);
        } catch (error) {
            console.error("Error fetching ERD: ", error);
        }
    };

    const handleClickSave = async () => {
        if (!erdName) {
            alert("ER図名を入力してください");
            return;
        }

        if (displayedNodes.length === 0) {
            alert("エンティティがありません");
            return;
        }

        const response = await fetch("/api/erd", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: erdName,
                entities: displayedNodes,
            }),
        });

        if (response.ok) {
            alert("保存しました");

            // 上書き保存対象に設定
            const { erd }: { erd: Erd; } = await response.json();
            setLoadedErd(erd);

            // 一覧に追加してER図名でソート
            const nextErds = erds.concat(erd).sort((a, b) => {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();

                if (nameA < nameB) {
                    return -1;
                }

                if (nameA > nameB) {
                    return 1;
                }

                return 0;
            });
            setErds(nextErds);
        } else {
            alert("保存に失敗しました");
        }
    };

    const handleClickOverwrite = async () => {
        if (!loadedErd) {
            alert("読み込みエラー");
            return;
        }

        const response = await fetch("/api/erd", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: loadedErd.id,
                entities: displayedNodes,
            }),
        });

        if (response.ok) {
            alert("保存しました");
        } else {
            alert("保存に失敗しました");
        }
    };

    return (
        <div className="flex flex-col w-64 px-2 border-r border-gray-200">
            <div className="space-y-4">
                <div>
                    <span>ER図読み込み</span>
                    <div className="mb-4">
                        <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ER図</label>
                        <select
                            id="countries"
                            className="
                                bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                            "
                            value={selectedErdId}
                            onChange={(e) => setSelectedErdId(e.target.value)}
                        >
                            <option value="">選択してください</option>
                            {erds.map((erd) => (
                                <option key={erd.id} value={erd.id}>{erd.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="button"
                        className="
                            text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
                            font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center
                        "
                        onClick={handleClickLoad}
                    >
                        読み込み
                    </button>
                </div>
                {loadedErd && (
                    <div>
                        <span>上書き保存</span>
                        <div className="mb-4">
                            <label htmlFor="overwrite-erd" className="block mb-2 text-sm font-medium text-gray-900">ER図名</label>
                            <input
                                type="text"
                                id="overwrite-erd"
                                value={loadedErd.name}
                                onChange={(e) => setErdName(e.target.value)}
                                className="
                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                    focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                                "
                                readOnly
                            />
                        </div>
                        <button
                            type="button"
                            className="
                                text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
                                font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center
                            "
                            onClick={handleClickOverwrite}
                        >
                            保存
                        </button>
                    </div>
                )}
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