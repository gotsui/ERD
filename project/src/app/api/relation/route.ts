import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Entity, EntityGroup, Relation } from "@/types/erd";

export async function GET() {
    try {
        const results = await prisma.entityGroup.findMany({
            include: {
                entities: {
                    include: {
                        attributes: true,
                    },
                },
            },
        });

        const entityGroups: EntityGroup[] = results.map(
            (entityGroup) => ({
                id: entityGroup.id,
                name: entityGroup.name,
                entities: entityGroup.entities.map(
                    (entity) => ({
                        id: entity.id,
                        type: entity.type,
                        position: { x: 0, y: 0 },
                        data: {
                            name: entity.name,
                            attributes: entity.attributes.map(
                                (attribute) => ({
                                    id: attribute.id,
                                    name: attribute.name,
                                    type: attribute.type,
                                })
                            ),
                        },
                    })
                ),
            })
        );

        // const edges: Relation[] = relations.map((relation) => ({
        //     id: relation.id,
        //     source: relation.sourceEntityId,
        //     target: relation.targetEntityId,
        //     sourceHandle: relation.sourceAttributeId,
        //     targetHandle: relation.targetAttributeId,
        //     label: relation.label || undefined,
        // }));

        return NextResponse.json({ entityGroups }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch Entity"}, { status: 500 });
    }
}