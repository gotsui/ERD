import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Entity, EntityGroup, Relation } from "@/types/erd";

export async function GET() {
    try {
        const relations = await prisma.relation.findMany();

        const edges: Relation[] = relations.map((relation) => ({
            id: relation.id,
            source: relation.sourceEntityId,
            target: relation.targetEntityId,
            sourceHandle: relation.sourceAttributeId,
            targetHandle: relation.targetAttributeId,
            label: relation.label || undefined,
        }));

        return NextResponse.json({ edges }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch Entity"}, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { relations }: { relations: Relation[]; } = await request.json();

        if (!relations) {
            return NextResponse.json({ error: "Bad Request" }, { status: 400 });
        }

        
        const added = await prisma.relation.createManyAndReturn({
            data: relations.map((relation) => ({
                sourceEntityId: relation.source,
                targetEntityId: relation.target,
                sourceAttributeId: relation.sourceHandle,
                targetAttributeId: relation.targetHandle,
            })),
        });

        const edges: Relation[] = added.map((edge) => ({
            id: edge.id,
            source: edge.sourceEntityId,
            target: edge.targetEntityId,
            sourceHandle: edge.sourceAttributeId,
            targetHandle: edge.targetAttributeId,
        }));

        return NextResponse.json({ edges }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create ERD" }, { status: 500 });
    }
}