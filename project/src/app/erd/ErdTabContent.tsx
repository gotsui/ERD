"use client";

import { useState } from "react";

const SaveTabContent: React.FC = () => {
    const [erdName, setErdName] = useState("");

    return (
        <div className="flex flex-col w-64 px-2 border-r border-gray-200">
            <form>
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
                    type="submit"
                    className="
                        text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
                        font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center
                    "
                >
                    保存
                </button>
            </form>
        </div>
    );
};

export default SaveTabContent;