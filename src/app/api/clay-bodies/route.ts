import { createApiHandler } from '@/lib/api/baseHandler';
import { prisma } from '@/lib/prisma';
import { clayBodySchema } from '@/lib/schemas/clay-body';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

// Helper function to ensure cone data is always an array
function ensureConeArray(coneData: string | string[] | undefined): string[] {
  if (!coneData) return [];
  if (typeof coneData === 'string') return [coneData];
  return coneData;
}

export const GET = createApiHandler(async (req, { session }) => {
  const clayBodies = await prisma.clayBody.findMany({
    where: { userId: session.user.id },
    include: {
      type: true,
      cone: true
    }
  });
  
  return NextResponse.json(clayBodies);
});

export const POST = createApiHandler(
  async (req, { session }) => {
    const body = await req.json();
    const { cone: coneData, ...rest } = body;

    // Ensure cone data is processed as an array
    const coneNames = ensureConeArray(coneData);

    // Convert string numbers to actual numbers
    const processedData = {
      ...rest,
      shrinkage: rest.shrinkage ? parseFloat(rest.shrinkage) : null,
      absorption: rest.absorption ? parseFloat(rest.absorption) : null,
      meshSize: rest.meshSize ? parseInt(rest.meshSize) : null,
    };

    const createData: Prisma.ClayBodyCreateInput = {
      ...processedData,
      type: {
        connect: { id: processedData.typeId }
      },
      cone: coneNames.length ? {
        connectOrCreate: coneNames.map((name: string) => ({
          where: { name },
          create: { name }
        }))
      } : undefined,
      user: {
        connect: {
          id: session.user.id
        }
      }
    };

    const clayBody = await prisma.clayBody.create({
      data: createData,
      include: {
        type: true,
        cone: true
      }
    });
    
    return NextResponse.json(clayBody);
  },
  { validationSchema: clayBodySchema }
);
