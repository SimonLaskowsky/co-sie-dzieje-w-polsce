import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const acts = await prisma.acts.findMany({
      select: {
        id: true,
        title: true,
        simple_title: true,
        content: true,
        announcement_date: true,
        keywords: true,
        item_type: true,
      },
    });
    return NextResponse.json(acts);
  } catch (error) {
    console.error('Error while downloading data:', error);
    return NextResponse.json({ error: 'Failed to download data' }, { status: 500 });
  }
}