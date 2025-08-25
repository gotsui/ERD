import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Attribute, Entity, Relation } from "@/types/erd";

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

export async function PUT(request: NextRequest) {
    try {
        const { id, attributes }: { id: string; attributes: Attribute[]; } = await request.json();

        if (!id || !attributes) {
            return NextResponse.json({ error: "Bad Request" }, { status: 400 });
        }

        await prisma.attribute.createMany({
            data: attributes.map((attribute) => ({
                entityId: id,
                name: attribute.name,
                type: attribute.type,
                comment: '',
            })),
        });

        const updated = await prisma.entity.findFirst({
            include: {
                entityGroup: true,
                attributes: true,
            },
            where: {
                id,
            },
        });

        if (!updated) {
            throw new Error("Failed to fetch Entity"); 
        }

        const entity: Entity = {
            id: updated.id,
            type: updated.type,
            position: {
                x: 0,
                y: 0,
            },
            data: {
                name: updated.name,
                groupName: updated.entityGroup.name,
                attributes: updated.attributes,
            },
        };

        return NextResponse.json({ entity }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update Entity" }, { status: 500 });
    }
}