import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Entity } from "@/types/erd";

export async function POST(request: NextRequest) {
    try {
        const { name, entities }: { name: string; entities: Entity[]; } = await request.json();

        if (!name || !entities) {
            return NextResponse.json({ error: "Bad Request" }, { status: 400 });
        }

        await prisma.$transaction(async (prisma) => {
            const erd = await prisma.erd.create({ data: { name } });

            await prisma.erdEntity.createMany({
                data: entities.map((entity) => ({
                    erdId: erd.id,
                    entityId: entity.id,
                    positionX: entity.position.x,
                    positionY: entity.position.y,
                })),
            });
        });

        return NextResponse.json({ status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create ERD" }, { status: 500 });
    }
}