import { createApiHandler } from '@/lib/api/baseHandler';
import { prisma } from '@/lib/prisma';
import { testTileSchema } from '@/types';

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
    const testTile = await prisma.testTile.create({
      data: {
        ...body,
        userId: session.user.id,
      }
    });
    
    return NextResponse.json(testTile);
  },
  { validationSchema: testTileSchema }
); 