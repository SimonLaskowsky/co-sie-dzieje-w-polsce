import { PrismaClient } from '@prisma/client';
import type { ActsAndKeywordsResponse, Act, Keyword } from '@/app/lib/types';

const prisma = new PrismaClient();

export const getActsAndKeywords =
  async (): Promise<ActsAndKeywordsResponse> => {
    try {
      const [acts, keywords] = await Promise.all([
        prisma.acts.findMany({
          select: {
            id: true,
            title: true,
            simple_title: true,
            content: true,
            announcement_date: true,
            promulgation: true,
            keywords: true,
            item_type: true,
            file: true,
            votes: true,
          },
        }) as unknown as Promise<Act[]>,
        prisma.keywords.findMany({
          select: {
            keyword: true,
          },
        }) as Promise<Keyword[]>,
      ]);

      return { acts, keywords };
    } catch (error) {
      console.error('Error while downloading data:', error);
      throw new Error('Failed to download data');
    }
  };
