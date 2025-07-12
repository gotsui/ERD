import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Entity, Relation } from "@/types/erd";

export async function GET() {
    try {
        const entities = await prisma.entity.findMany({
            include: { entityGroup: true, attributes: true },
            orderBy: [{ name: "asc" }],
        });

        const relations = await prisma.relation.findMany();

        const nodes: Entity[] = entities.map((entity, index) => ({
            id: entity.id,
            type: entity.type,
            position: { x: index * 300 + 100, y: 100 },
            data: {
                name: entity.name,
                groupName: entity.entityGroup.name,
                attributes: entity.attributes,
            },
        }));

        const edges: Relation[] = relations.map((relation) => ({
            id: relation.id,
            source: relation.sourceEntityId,
            target: relation.targetEntityId,
            sourceHandle: relation.sourceAttributeId,
            targetHandle: relation.targetAttributeId,
            label: relation.label || undefined,
        }));

        return NextResponse.json({ nodes, edges }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch Entity" }, { status: 500 });
    }
}