import { Attribute, Entity } from "@/types/erd";
import { useEffect, useState } from "react";

type EditTabContentProps = {
    selectedEntity: Entity | null;
    updateEntity: (entity: Entity) => void;
};

const EditTabContent: React.FC<EditTabContentProps> = ({
    selectedEntity,
    updateEntity,
}) => {
    const [isShowEditor, setIsShowEditor] = useState(false);
    const [addedAttributes, setAddedAttributes] = useState<Attribute[]>([]);

    const [attributeName, setAttributeName] = useState("");
    const [attributeType, setAttributeType] = useState("");
    const [remarks, setRemarks] = useState("");

    useEffect(() => {
        setIsShowEditor(false);
        setAddedAttributes([]);
        setAttributeName("");
        setAttributeType("");
        setRemarks("");
    }, [selectedEntity]);

    const handleClickAdd = () => {
        if (!attributeName || !attributeType) {
            alert("属性名と型を入力してください");
            return;
        }

        const adding: Attribute = {
            id: new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16),
            name: attributeName,
            type: attributeType,
        };
        setAddedAttributes(addedAttributes.concat(adding));
        setAttributeName("");
        setAttributeType("");
        setRemarks("");
    };

    const handleClickSave = async () => {
        const response = await fetch("/api/entity", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: selectedEntity?.id,
                attributes: addedAttributes,
            }),
        });

        if (response.ok) {
            alert("保存しました");
            const { entity }: { entity: Entity; } = await response.json();
            updateEntity(entity);
        } else {
            alert("保存に失敗しました");
        }
    };

    if (!selectedEntity) {
        return (
            <div className="flex flex-col w-64 px-2 border-r border-gray-200">
                <span>エンティティを選択してください</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-64 px-2 border-r border-gray-200">
            {selectedEntity && (
                <div className="flex flex-col">
                    <span>グループ: {selectedEntity.data.groupName}</span>
                    <span>エンティティ: {selectedEntity.data.name}</span>
                </div>
            )}
            <div>属性</div>
            <div className="px-4">
                {selectedEntity?.data.attributes.map((attribute) => (
                    <div key={attribute.id}>
                        {attribute.name}
                    </div>
                ))}
                {selectedEntity && addedAttributes.map((attribute) => (
                    <div key={attribute.id}>
                        <span className="text-red-600">*</span>
                        {attribute.name}
                    </div>
                ))}
                {addedAttributes.length > 0 && (
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4"
                        onClick={() => handleClickSave()}
                    >
                        保存
                    </button>
                )}
            </div>
            {isShowEditor ? (
                <div className="mt-4">
                    <span>属性追加</span>
                    <div>
                        <label htmlFor="attr-name" className="block mb-2 text-sm font-medium text-gray-900">属性名</label>
                        <input
                            type="text"
                            id="attr-name"
                            value={attributeName}
                            onChange={(e) => setAttributeName(e.target.value)}
                            className="
                                bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                            "
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="attr-type" className="block mb-2 text-sm font-medium text-gray-900">型</label>
                        <input
                            type="text"
                            id="attr-type"
                            value={attributeType}
                            onChange={(e) => setAttributeType(e.target.value)}
                            className="
                                bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                            "
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="attr-remarks" className="block mb-2 text-sm font-medium text-gray-900">備考</label>
                        <input
                            type="text"
                            id="attr-remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="
                                bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                            "
                            required
                        />
                    </div>
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4"
                        onClick={() => handleClickAdd()}
                    >
                        追加
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 mt-4"
                        onClick={() => setIsShowEditor(false)}
                    >
                        キャンセル
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={() => setIsShowEditor(true)}
                >
                    属性追加
                </button>
            )}
        </div>
    );
};

export default EditTabContent;