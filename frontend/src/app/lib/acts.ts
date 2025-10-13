import { PrismaClient } from '@prisma/client';
import type { ActsAndKeywordsResponse, Act, Category } from '@/types';

const prisma = new PrismaClient();

export const getActsAndKeywords =
  async (): Promise<ActsAndKeywordsResponse> => {
    try {
      const [acts, category] = await Promise.all([
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
            category: true,
          },
        }) as unknown as Promise<Act[]>,
        prisma.category.findMany({
          select: {
            category: true,
          },
        }) as Promise<Category[]>,
      ]);

      return { acts, categories: category };
    } catch (error) {
      console.error('Error while downloading data:', error);
      throw new Error('Failed to download data');
    }
  };
