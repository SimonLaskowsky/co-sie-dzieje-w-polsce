import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('Próba połączenia z bazą i pobrania danych...');
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
    console.log('Pobrane dane:', acts);
    return NextResponse.json(acts);
  } catch (error) {
    console.error('Błąd podczas pobierania danych:', error);
    return NextResponse.json({ error: 'Nie udało się pobrać danych' }, { status: 500 });
  }
}