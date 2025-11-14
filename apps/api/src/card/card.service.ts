import { Injectable } from '@nestjs/common';
import { CreateCardParamDto } from './dto/create-card-param.dto';
import { UpdateCardParamDto } from './dto/update-card-param.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCardDto } from './dto/update-card.dto';
import { $ } from 'bun';

@Injectable()
export class CardService {
  constructor(private readonly prisma: PrismaService) {}

  async findVocabularyCard(listId: string, reset: boolean | undefined) {
    try {
      let vocabularyList = await this.prisma.vocabularyList.findMany({
        where: { listId },
        include: { vocabulary: true },
        orderBy: { order: 'asc' },
      });

      const allReviewsTrue = vocabularyList.every(
        (item) => item.review === true,
      );
      if (allReviewsTrue || reset) {
        await this.prisma.vocabularyList.updateMany({
          where: { listId },
          data: { review: false },
        });

        vocabularyList = await this.prisma.vocabularyList.findMany({
          where: { listId },
          include: { vocabulary: true },
          orderBy: { order: 'asc' },
        });
      }

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
      // Update Vocabulary list -> review
      const VocabularyList = await this.prisma.vocabularyList.update({
        where: {
          listId_vocabularyId: {
            listId: updateCardDto.listId,
            vocabularyId: updateCardDto.vocabularyId,
          },
        },
        data: { review: updateCardDto.isKnown ? true : false },
      });

      // Update Vocabulary Progress
      const vocabularyProgress =
        await this.prisma.vocabularyProgress.findUnique({
          where: {
            userId_vocabularyId: {
              userId: userId,
              vocabularyId: updateCardDto.vocabularyId,
            },
          },
        });

      // If Vocabulary Progress doesn't exist, create it
      if (!vocabularyProgress) {
        const newProgress = await this.prisma.vocabularyProgress.create({
          data: {
            userId,
            vocabularyId: updateCardDto.vocabularyId,
            score: 1,
            reviewNumber: 1,
            lastReview: new Date(),
          },
        });
        // Enregistrer la création dans l'historique
        await this.prisma.vocabularyProgressHistory.create({
          data: {
            progressId: newProgress.id,
            score: newProgress.score,
            lastReview: newProgress.lastReview,
            reviewNumber: newProgress.reviewNumber,
            changedBy: 'SYSTEM', // ou userId si tu veux tracer qui a fait le changement
            changeType: 'CREATE',
          },
        });
        return;
      }

      // Enregistrer l'état actuel dans l'historique avant la mise à jour
      await this.prisma.vocabularyProgressHistory.create({
        data: {
          progressId: vocabularyProgress.id,
          score: vocabularyProgress.score,
          lastReview: vocabularyProgress.lastReview,
          reviewNumber: vocabularyProgress.reviewNumber,
          changedBy: userId, // ou 'SYSTEM' si c'est automatique
          changeType: 'UPDATE_BEFORE',
        },
      });

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
      const updatedProgress = await this.prisma.vocabularyProgress.update({
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

      this.updateList(
        userId,
        updateCardDto.vocabularyId,
        newScore,
        currentScore,
      );
    } catch (error) {
      console.error('Error updating vocabulary cards:', error);
      throw new Error('Failed to update vocabulary cards');
    }
  }

  async updateList(
    userId: string,
    vocabularyId: string,
    newScore: number,
    currentScore: number,
  ) {
    // If the vocabulary is becoming known
    const isBecomingKnown = newScore >= 80 && currentScore < 80;
    // If the vocabulary is becoming unknown
    const isBecomingUnknown = newScore < 80 && currentScore >= 80;

    // If no status change, exit
    if (!isBecomingKnown && !isBecomingUnknown) {
      return;
    }

    // Get both lists
    const [knowList, unknownList] = await Promise.all([
      this.prisma.lists.findFirst({
        where: { name: 'Known List', userId },
      }),
      this.prisma.lists.findFirst({
        where: { name: 'Unknown List', userId },
      }),
    ]);

    if (!knowList || !unknownList) {
      throw new Error('Required lists not found');
    }

    const { sourceList, targetList } = isBecomingKnown
      ? { sourceList: unknownList, targetList: knowList }
      : { sourceList: knowList, targetList: unknownList };

    // Get the last order of the target list
    const lastEntry = await this.prisma.vocabularyList.findFirst({
      where: { listId: targetList.id },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const nextOrder = lastEntry ? lastEntry.order + 1 : 1;

    // Transaction to ensure consistency
    await this.prisma.$transaction([
      // Remove from source list
      this.prisma.vocabularyList.delete({
        where: {
          listId_vocabularyId: {
            listId: sourceList.id,
            vocabularyId,
          },
        },
      }),
      // Add to target list with the correct order
      this.prisma.vocabularyList.create({
        data: {
          listId: targetList.id,
          vocabularyId,
          order: nextOrder,
        },
      }),
    ]);
  }

  async rollbackProgress(
    userId: string,
    body: { listId: string; vocabularyId: string },
  ) {
    try {
      // 1. Get current progress
      const currentProgress = await this.prisma.vocabularyProgress.findUnique({
        where: {
          userId_vocabularyId: {
            userId: userId,
            vocabularyId: body.vocabularyId,
          },
        },
      });

      if (!currentProgress) {
        throw new Error(
          'Aucun VocabularyProgress trouvé pour cet utilisateur et ce vocabulaire.',
        );
      }

      // 2. Get last history entry
      const lastHistoryEntry =
        await this.prisma.vocabularyProgressHistory.findFirst({
          where: {
            progressId: currentProgress.id,
          },
          orderBy: {
            changedAt: 'desc',
          },
        });

      if (!lastHistoryEntry) {
        throw new Error(
          "Aucune entrée dans l'historique pour effectuer un rollback.",
        );
      }

      // 3. Update VocabularyProgress with history values
      const rolledBackProgress = await this.prisma.vocabularyProgress.update({
        where: {
          userId_vocabularyId: {
            userId: userId,
            vocabularyId: body.vocabularyId,
          },
        },
        data: {
          score: lastHistoryEntry.score,
          lastReview: lastHistoryEntry.lastReview,
          reviewNumber: lastHistoryEntry.reviewNumber,
        },
      });

      // 4. Save this rollback action in the history
      await this.prisma.vocabularyProgressHistory.create({
        data: {
          progressId: currentProgress.id,
          score: rolledBackProgress.score,
          lastReview: rolledBackProgress.lastReview,
          reviewNumber: rolledBackProgress.reviewNumber,
          changedBy: userId,
          changeType: 'ROLLBACK',
        },
      });

      return rolledBackProgress;
    } catch (error) {
      console.error('Error rolling back vocabulary progress:', error);
      throw new Error('Failed to rollback vocabulary progress');
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

  async resetCard(body: { listId: string }) {
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
