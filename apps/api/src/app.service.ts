import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello There!';
  }

  async getDashboard() {
    try {
      const countVocabulary = await this.prisma.vocabulary.count();
      const knowVocabulary = await this.prisma.vocabularyProgress.findMany({
        where: {
          score: {
            gte: 80,
          },
        },
        select: {
          _count: true,
        },
      });

      const learnVocabulary = await this.prisma.vocabularyProgress.findMany({
        where: {
          score: {
            gte: 20,
            lt: 80,
          },
        },
        select: {
          _count: true,
        },
      });

      const unknownVocabulary = await this.prisma.vocabularyProgress.findMany({
        where: {
          score: {
            lt: 20,
          },
        },
        select: {
          _count: true,
        },
      });

      const lastListLearned = await this.prisma.vocabularyList.findFirst({
        where: {
          updatedAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
        select: {
          list: true,
          vocabulary: true,
        },
      });

      return {
        countVocabulary,
        knowVocabulary,
        learnVocabulary,
        unknownVocabulary,
        lastListLearned: lastListLearned?.list,
      };
    } catch (error) {
      console.error('Error fetching lists:', error);
      throw new Error('Failed to fetch lists');
    }
  }
}
