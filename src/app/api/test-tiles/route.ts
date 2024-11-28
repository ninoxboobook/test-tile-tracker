import { createApiHandler } from '@/lib/api/baseHandler';
import { prisma } from '@/lib/prisma';
import { testTileSchema } from '@/types';
import { NextResponse } from 'next/server';

export const GET = createApiHandler(async (req, { session }) => {
  const testTiles = await prisma.testTile.findMany({
    where: { userId: session.user.id },
    include: { clayBody: true, decorations: true }
  });
  
  return NextResponse.json(testTiles);
});

export const POST = createApiHandler(
  async (req, { session }) => {
    const body = await req.json();
    const { decorationIds, collectionIds, ...rest } = body;

    const testTile = await prisma.testTile.create({
      data: {
        ...rest,
        userId: session.user.id,
        decorations: decorationIds?.length ? {
          connect: decorationIds.map((id: string) => ({ id }))
        } : undefined,
        collections: collectionIds?.length ? {
          connect: collectionIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        clayBody: true,
        decorations: true,
        collections: true
      }
    });
    
    return NextResponse.json(testTile);
  },
  { validationSchema: testTileSchema }
);