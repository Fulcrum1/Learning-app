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

      // const lastListLearned = await this.prisma.vocabularyList.findMany({
      //   where: {
      //     updatedAt: {
      //       gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      //     },
      //   },
      //   select: {
      //     list: true,
      //     vocabulary: true,
      //   },
      // });

      const lastListLearned = await this.prisma.vocabularyList.findFirst({
        where: {
          updatedAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
        select: {
          list: true,
        },
      });

      const lastListLearnedVocabulary =
        await this.prisma.vocabularyList.findMany({
          where: {
            listId: lastListLearned?.list.id,
          },
          select: {
            vocabulary: true,
          },
        });
      const lastListKnownCount = await this.prisma.vocabularyProgress.count({
        where: {
          vocabularyId: {
            in: lastListLearnedVocabulary.map((v) => v.vocabulary.id),
          },
          score: {
            gte: 80,
          },
        },
      });

      const lastListLearningCount = await this.prisma.vocabularyProgress.count({
        where: {
          vocabularyId: {
            in: lastListLearnedVocabulary.map((v) => v.vocabulary.id),
          },
          score: {
            gte: 20,
            lt: 80,
          },
        },
      });

      const lastListUnknownCount = await this.prisma.vocabularyProgress.count({
        where: {
          vocabularyId: {
            in: lastListLearnedVocabulary.map((v) => v.vocabulary.id),
          },
          score: {
            lt: 20,
          },
        },
      });

      return {
        countVocabulary,
        knowVocabulary,
        learnVocabulary,
        unknownVocabulary,
        lastListLearned: lastListLearned?.list,

        lastListKnown: lastListKnownCount,
        lastListLearning: lastListLearningCount,
        lastListUnknown: lastListUnknownCount,
      };
    } catch (error) {
      console.error('Error fetching lists:', error);
      throw new Error('Failed to fetch lists');
    }
  }
}
