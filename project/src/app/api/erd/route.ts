import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Entity } from "@/types/erd";

export async function GET() {
    try {
        const erds = await prisma.erd.findMany();

        return NextResponse.json({ erds }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch ERD" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name, entities }: { name: string; entities: Entity[]; } = await request.json();

        if (!name || !entities) {
            return NextResponse.json({ error: "Bad Request" }, { status: 400 });
        }

        const erd = await prisma.$transaction(async (prisma) => {
            const erd = await prisma.erd.create({ data: { name } });

            await prisma.erdEntity.createMany({
                data: entities.map((entity) => ({
                    erdId: erd.id,
                    entityId: entity.id,
                    positionX: entity.position.x,
                    positionY: entity.position.y,
                })),
            });

            return erd;
        });

        return NextResponse.json({ erd }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create ERD" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { id, entities }: { id: string; entities: Entity[]; } = await request.json();

        if (!id || !entities) {
            return NextResponse.json({ error: "Bad Request" }, { status: 400 });
        }

        await prisma.$transaction(async () => {
            await prisma.erdEntity.deleteMany({
                where: {
                    erdId: id,
                },
            });

            await prisma.erdEntity.createMany({
                data: entities.map((entity) => ({
                    erdId: id,
                    entityId: entity.id,
                    positionX: entity.position.x,
                    positionY: entity.position.y,
                })),
            });
        });

        return NextResponse.json({ status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update ERD" }, { status: 500 });
    }
}