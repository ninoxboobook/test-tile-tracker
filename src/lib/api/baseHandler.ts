import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema } from 'zod';
import { getServerSession } from 'next-auth';

type HandlerFunction = (req: NextRequest, context: { session: any }) => Promise<NextResponse>;

interface HandlerOptions {
  requireAuth?: boolean;
  validationSchema?: ZodSchema;
}

export function createApiHandler(
  handler: HandlerFunction,
  options: HandlerOptions = { requireAuth: true }
) {
  return async function(req: NextRequest) {
    try {
      const session = await getServerSession();

      if (options.requireAuth && !session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      if (options.validationSchema && req.method !== 'GET') {
        const body = await req.json();
        try {
          options.validationSchema.parse(body);
        } catch (error) {
          return NextResponse.json({ error: 'Validation failed', details: error }, { status: 400 });
        }
      }

      return await handler(req, { session });
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
} 