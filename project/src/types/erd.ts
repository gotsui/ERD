export type ERNodeType = "table" | "tool" | "plugin";

export type Column = {
    id: string;
    name: string;
    type: string;
    isRequired: boolean;
    isUnique: boolean;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
};

export type UI = {
    id: string;
    name: string;
};

export type Plugin = {
    id: string;
    name: string;
};

export type ERNode = {
    id: string;
    type: ERNodeType;
    position: { x: number; y: number; };
    data: 
        | { name: string; columns: Column[]; }
        | { name: string; uis: UI[]; }
        | { name: string; }
};

export type EREdge = {
    id: string;
    source: string;
    target: string;
    sourceHandle: string;
    targetHandle: string;
    label?: string;
};

export type ERD = {
    nodes: ERNode[];
    edges: EREdge[];
};