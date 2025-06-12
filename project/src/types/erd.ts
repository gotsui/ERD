export type EntityType = "table" | "page" | "plugin";

export type EntityGroup = {
    id: string;
    name: string;
    entities: Entity[];
};

export type Entity = {
    id: string;
    type: EntityType;
    position: { x: number; y: number; };
    data: { name: string; attributes: Attribute[]; };
};

export type Attribute = {
    id: string;
    name: string;
    type: string;
};

export type Relation = {
    id: string;
    source: string;
    target: string;
    sourceHandle: string;
    targetHandle: string;
    label?: string;
};
