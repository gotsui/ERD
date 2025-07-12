import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Entity, Relation } from "@/types/erd";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    try {
        const erdId = params.id;

        const erdEntities = await prisma.erdEntity.findMany({
            include: {
                entity: {
                    include: {
                        entityGroup: { select: { name: true } },
                        attributes: true,
                    },
                },
            },
            where: {
                erdId,
            },
        });

        const entities: Entity[] = erdEntities.map((erdEntity) => ({
            id: erdEntity.entity.id,
            type: erdEntity.entity.type,
            position: {
                x: erdEntity.positionX,
                y: erdEntity.positionY,
            },
            data: {
                name: erdEntity.entity.name,
                groupName: erdEntity.entity.entityGroup.name,
                attributes: erdEntity.entity.attributes,
            },
        }));

        return NextResponse.json({ entities }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch ERD Entity" }, { status: 500 });
    }
}