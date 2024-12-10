import { createApiHandler } from '@/lib/api/baseHandler';
import { prisma } from '@/lib/prisma';
import { testTileSchema } from '@/lib/schemas/test-tile';
import { NextResponse } from 'next/server';

export const GET = createApiHandler(async (req, { session }) => {
  const testTiles = await prisma.testTile.findMany({
    where: { userId: session.user.id },
    include: { 
      clayBody: true, 
      decorationLayers: {
        include: {
          decorations: true
        }
      },
      atmosphere: true,
      cone: true
    }
  });
  
  return NextResponse.json(testTiles);
});

export const POST = createApiHandler(
  async (req, { session }) => {
    const body = await req.json();
    const { decorationLayers, collectionIds, atmosphere: atmosphereNames, cone: coneNames, ...rest } = body;

    const testTile = await prisma.testTile.create({
      data: {
        ...rest,
        userId: session.user.id,
        decorationLayers: {
          create: decorationLayers.map((layer: any) => ({
            order: layer.order,
            decorations: {
              connect: layer.decorationIds.map((id: string) => ({ id }))
            }
          }))
        },
        collections: collectionIds?.length ? {
          connect: collectionIds.map((id: string) => ({ id }))
        } : undefined,
        atmosphere: atmosphereNames?.length ? {
          connectOrCreate: atmosphereNames.map((name: string) => ({
            where: { name },
            create: { name }
          }))
        } : undefined,
        cone: coneNames?.length ? {
          connectOrCreate: coneNames.map((name: string) => ({
            where: { name },
            create: { name }
          }))
        } : undefined
      },
      include: {
        clayBody: true,
        decorationLayers: {
          include: {
            decorations: true
          }
        },
        collections: true,
        atmosphere: true,
        cone: true
      }
    });
    
    return NextResponse.json(testTile);
  },
  { validationSchema: testTileSchema }
);