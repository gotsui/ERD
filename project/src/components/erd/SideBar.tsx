import { Entity, Relation } from "@/types/erd";
import { SideTabType } from "./SideTab";

type SideBarProps = {
    nodes: Entity[];
    edges: Relation[];
    selectedTab: SideTabType;
};

const SideBar: React.FC<SideBarProps> = ({
    nodes,
    edges,
    selectedTab,
}) => {
    return (
        <aside className="flex flex-col h-full overflow-hidden border-r border-gray-200">
            {selectedTab == "table" && (
                <section className="px-2 h-full bg-pink-50">
                    <div className="flex items-center justify-between gap-4 py-1">
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
            {selectedTab == "page" && (
                <section className="px-2 h-full bg-orange-50">
                    <div className="flex items-center justify-between gap-4 py-1">
                        <div>P</div>
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
                                (node) => node.type === "page"
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
            {selectedTab == "plugin" && (
                <section className="px-2 h-full bg-green-50">
                    <div className="flex items-center justify-between gap-4 py-1">
                        <div>P</div>
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
                                (node) => node.type === "plugin"
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
            {selectedTab == "relation" && (
                <section className="px-2 h-full bg-blue-50">
                    <div className="flex items-center justify-between gap-4 py-1">
                        <div>R</div>
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
                            edges.map(
                                (edge) => (
                                    <div
                                        key={edge.id}
                                        className="
                                            rounded-md border-b px-2
                                            text-sm font-medium h-11
                                            flex items-center
                                        "
                                    >
                                        {edge.source}.{edge.sourceHandle}
                                        -
                                        {edge.target}.{edge.targetHandle}
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