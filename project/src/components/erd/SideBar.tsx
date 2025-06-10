import { EREdge, ERNode, ERNodeType } from "@/types/erd";

type SideBarProps = {
    nodes: ERNode[];
    edges: EREdge[];
    selectedTab: ERNodeType | "relation";
};

const SideBar: React.FC<SideBarProps> = ({
    nodes,
    edges,
    selectedTab,
}) => {
    return (
        <aside
            className="
                flex flex-col h-full overflow-hidden
                border-r border-gray-200
            "
        >
            {selectedTab == "table" && (
                <section className="px-2">
                    <div
                        className="
                            flex items-center justify-between gap-4 py-1
                        "
                    >
                        <div>T</div>
                        <div className="flex-1">filter</div>
                        <button
                            className="
                                inline-flex items-center justify-center
                                whitespace-nowrap rounded-md font-medium
                            "
                        >
                            add
                        </button>
                    </div>
                    <div
                        className="
                            relative flex flex-col flex-1
                            gap-1 overflow-hidden
                        "
                    >
                        {
                            nodes.filter(
                                (node) => node.type === "table"
                            ).map(
                                (node) => (
                                    <div
                                        key={node.id}
                                        className="
                                            rounded-md border-b px-2
                                            text-sm font-medium h-11
                                            flex items-center
                                        "
                                    >
                                        {node.data.name}
                                    </div>
                                )
                            )
                        }
                    </div>
                </section>
            )}
        </aside>
    );
};

export default SideBar;