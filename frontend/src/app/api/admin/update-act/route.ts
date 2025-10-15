import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClerkClient } from '@clerk/backend';
import { z } from 'zod';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const updateActSchema = z.object({
  actId: z.number().int().positive(),
  content: z.string().max(50000).optional(),
  simpleTitle: z.string().max(500).optional(),
  impactSection: z.string().max(10000).optional(),
});

type UpdateActRequest = z.infer<typeof updateActSchema>;

interface UpdateActResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    confidenceScore: number;
    updatedAt: string;
  };
}

export const POST = async (
  request: Request
): Promise<NextResponse<UpdateActResponse>> => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await clerkClient.users.getUser(userId);

    if (!user.publicMetadata?.role || user.publicMetadata.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin role required' },
        { status: 403 }
      );
    }

    let validatedData: UpdateActRequest;

    try {
      const requestBody = await request.json();
      validatedData = updateActSchema.parse(requestBody);
    } catch (error) {
      console.error('Validation error:', error);
      return NextResponse.json(
        { success: false, message: 'Invalid request data' },
        { status: 400 }
      );
    }

    try {
      const existingAct = await prisma.acts.findUnique({
        where: { id: validatedData.actId },
      });

      if (!existingAct) {
        return NextResponse.json(
          { success: false, message: 'Act not found' },
          { status: 404 }
        );
      }

      const updateData: Record<string, unknown> = {
        confidence_score: new Prisma.Decimal(9.99),
      };

      if (validatedData.content !== undefined) {
        updateData.content = validatedData.content;
      }
      if (validatedData.simpleTitle !== undefined) {
        updateData.simple_title = validatedData.simpleTitle;
      }
      if (validatedData.impactSection !== undefined) {
        updateData.impact_section = validatedData.impactSection;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatedAct: any = await prisma.acts.update({
        where: { id: validatedData.actId },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: updateData as any,
      });

      try {
        const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

        if (deployHookUrl) {
          fetch(deployHookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }).catch(webhookError => {
            console.error('Webhook trigger failed:', webhookError);
          });
        } else {
          console.warn('VERCEL_DEPLOY_HOOK_URL not configured');
        }
      } catch (webhookError) {
        console.error('Webhook trigger error:', webhookError);
      }

      return NextResponse.json({
        success: true,
        message: 'Act updated successfully. Rebuild in progress (~2-5 min).',
        data: {
          id: updatedAct.id,
          confidenceScore: Number(updatedAct.confidence_score?.toString() || 0),
          updatedAt: updatedAct.updated_at.toISOString(),
        },
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { success: false, message: 'Database error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating act:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
};
