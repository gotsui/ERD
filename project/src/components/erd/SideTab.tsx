import { EntityType } from "@/types/erd";

export type SideTabType = EntityType | "relation";

type SideTabProps = {
    onTabClick: (tabName: SideTabType) => void;
};

const SideTab: React.FC<SideTabProps> = ({ onTabClick }) => {
    return (
        <div
            className="
                flex flex-col bg-gray-100
                border border-gray-200 h-full overflow-y-auto
            "
        >
            <button
                onClick={() => onTabClick("table")}
                className="
                    px-4 py-2 border rounded
                    bg-pink-100 hover:bg-pink-200
                "
            >
                table
            </button>
            <button
                onClick={() => onTabClick("page")}
                className="
                    px-4 py-2 border rounded
                    bg-orange-100 hover:bg-orange-200
                "
            >
                page
            </button>
            <button
                onClick={() => onTabClick("plugin")}
                className="
                    px-4 py-2 border rounded
                    bg-green-100 hover:bg-green-200
                "
            >
                plugin
            </button>
            <button
                onClick={() => onTabClick("relation")}
                className="
                    px-4 py-2 border rounded
                    bg-blue-100 hover:bg-blue-200
                "
            >
                relation
            </button>
        </div>
    );
};

export default SideTab;