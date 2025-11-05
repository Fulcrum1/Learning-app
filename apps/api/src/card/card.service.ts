import { Injectable } from '@nestjs/common';
import { CreateCardParamDto } from './dto/create-card-param.dto';
import { UpdateCardParamDto } from './dto/update-card-param.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCardDto } from './dto/update-card.dto';
import { $ } from 'bun';

@Injectable()
export class CardService {
  constructor(private readonly prisma: PrismaService) {}

  async findVocabularyCard(listId: string, reset: boolean | undefined) {
    try {
      const vocabularyList = await this.prisma.vocabularyList.findMany({
        where: { listId },
        include: {
          vocabulary: true,
        },
        orderBy: {
          order: 'asc',
        },
      });
      return {
        vocabulary: vocabularyList.map((vl) => ({
          ...vl.vocabulary,
          review: vl.review,
        })),
      };
    } catch (error) {
      console.error('Error fetching vocabulary cards:', error);
      throw new Error('Failed to fetch vocabulary cards');
    }
  }

  async updateProgress(userId: string, updateCardDto: UpdateCardDto) {
    try {
      console.log({ userId });
      console.log({ listId: updateCardDto.listId });
      console.log({ vocabularyId: updateCardDto.vocabularyId });
      console.log({ isKnown: updateCardDto.isKnown });

      // Update Vocabulary list -> review
      const VocabularyList = await this.prisma.vocabularyList.update({
        where: {
          listId_vocabularyId: {
            listId: updateCardDto.listId,
            vocabularyId: updateCardDto.vocabularyId,
          },
        },
        data: { review: true },
      });

      // Update Vocabulary Progress
      const vocabularyProgress = await this.prisma.vocabularyProgress.findUnique({
        where: {
          userId_vocabularyId: {
            userId: userId,
            vocabularyId: updateCardDto.vocabularyId,
          },
        },
      });

      // If Vocabulary Progress doesn't exist, create it
      if (!vocabularyProgress) {
        await this.prisma.vocabularyProgress.create({
          data: {
            userId,
            vocabularyId: updateCardDto.vocabularyId,
            score: 1,
            reviewNumber: 1,
            lastReview: new Date(),
          },
        });
        return;
      }

      // Calculate the new score
      const { score: currentScore, reviewNumber } = vocabularyProgress;
      const learningFactor = 0.2;

      let newScore = currentScore;

      // Update the score
      if (updateCardDto.isKnown) {
        const increase =
          (100 - currentScore) * (learningFactor / (reviewNumber + 1));
        newScore = currentScore + increase;
      } else {
        const decrease = currentScore * 0.1;
        newScore = currentScore - decrease;
      }

      // Ensure the score stays between 1 and 100
      newScore = Math.max(1, Math.min(100, newScore));

      // Update the database
      await this.prisma.vocabularyProgress.update({
        where: {
          userId_vocabularyId: {
            userId: userId,
            vocabularyId: updateCardDto.vocabularyId,
          },
        },
        data: {
          score: Math.round(newScore),
          reviewNumber: reviewNumber + 1,
          lastReview: new Date(),
        },
      });
    } catch (error) {
      console.error('Error updating vocabulary cards:', error);
      throw new Error('Failed to update vocabulary cards');
    }
  }

  async findParamCard(userId: string) {
    try {
      const cardParam = await this.prisma.cardParam.findFirst({
        where: { userId },
        include: {
          user: true,
        },
      });
      return {
        cardParam,
      };
    } catch (error) {
      console.error('Error fetching vocabulary cards:', error);
      throw new Error('Failed to fetch vocabulary cards');
    }
  }

  async resetCard(userId: string, body: { listId: string }) {
    try {
      const vocabularyList = await this.prisma.vocabularyList.updateMany({
        where: { listId: body.listId },
        data: { review: false },
      });
      return {
        vocabularyList,
      };
    } catch (error) {
      console.error('Error resetting vocabulary cards:', error);
      throw new Error('Failed to reset vocabulary cards');
    }
  }
  // async updateParamCard(
  //   userId: string,
  //   updateCardParamDto: UpdateCardParamDto,
  // ) {
  //   try {
  //     const cardParam = await this.prisma.cardParam.update({
  //       where: { userId: userId },
  //       data: updateCardParamDto,
  //     });
  //     return {
  //       cardParam,
  //     };
  //   } catch (error) {
  //     console.error('Error updating vocabulary cards:', error);
  //     throw new Error('Failed to update vocabulary cards');
  //   }
  // }
  async updateParamCard(
    userId: string,
    updateCardParamDto: UpdateCardParamDto,
  ) {
    try {
      // Vérifions d'abord si l'utilisateur a déjà des paramètres
      const existingParams = await this.prisma.cardParam.findFirst({
        where: { userId: userId },
      });

      let cardParam;

      if (existingParams) {
        // Mise à jour si des paramètres existent
        cardParam = await this.prisma.cardParam.update({
          where: { id: existingParams.id }, // Utilisez l'ID du paramètre existant
          data: updateCardParamDto,
        });
      } else {
        // Création si aucun paramètre n'existe
        cardParam = await this.prisma.cardParam.create({
          data: {
            ...updateCardParamDto,
            userId: userId,
          },
        });
      }

      return { cardParam };
    } catch (error) {
      console.error('Error updating card parameters:', error);
      throw new Error('Failed to update card parameters');
    }
  }
}
