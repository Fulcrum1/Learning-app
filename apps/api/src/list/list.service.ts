import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { PrismaService } from '../prisma/prisma.service';

interface CreateProgressDto {
  vocabulary: string[];
  userId: string;
}

@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createListDto: CreateListDto) {
    return this.createList(createListDto);
  }

  async createProgress(createProgressDto: CreateProgressDto) {
    const { vocabulary, userId } = createProgressDto;
    if (vocabulary.length > 0) {
      const existingVocabProgress =
        await this.prisma.vocabularyProgress.findMany({
          where: {
            userId,
            vocabularyId: { in: vocabulary },
          },
          select: { vocabularyId: true },
        });
      const newVocabularies = vocabulary.filter(
        (id) =>
          !existingVocabProgress.some(
            (progress) => progress.vocabularyId === id,
          ),
      );
      if (newVocabularies.length > 0) {
        await this.prisma.vocabularyProgress.createMany({
          data: newVocabularies.map((vocabularyId) => ({
            score: 0,
            lastReview: new Date(),
            vocabularyId,
            userId,
          })),
          skipDuplicates: true,
        });
      }
    }
  }

  async createList(createListDto: CreateListDto) {
    const { name, description, userId, vocabulary = [] } = createListDto;
    if (!userId) {
      throw new Error('User ID is required to create a list');
    }
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      await this.createProgress({ vocabulary, userId });
      const createdList = await this.prisma.lists.create({
        data: {
          name,
          description: description || '',
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      if (vocabulary.length > 0) {
        await this.prisma.vocabularyList.createMany({
          data: vocabulary.map((vocabularyId, index) => ({
            listId: createdList.id,
            vocabularyId,
            order: index,
          })),
        });
      }
      return createdList;
    } catch (error) {
      console.error('Error creating list:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to create list: ' + error.message);
    }
  }

  async findAll() {
    try {
      return await this.prisma.lists.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          vocabularyItems: {
            include: {
              vocabulary: true,
            },
          },
          _count: {
            select: {
              vocabularyItems: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching lists:', error);
      throw new Error('Failed to fetch lists');
    }
  }

  // async findVocabularyCategory() {
  //   try {
  //     const [vocabulary, categories] = await Promise.all([
  //       this.prisma.vocabulary.findMany({
  //         include: {
  //           VocabularyToCategories: {
  //             include: {
  //               category: true,
  //             },
  //           },
  //         },
  //       }),
  //       this.prisma.categories.findMany({
  //         include: {
  //           _count: {
  //             select: { VocabularyToCategories: true },
  //           },
  //           VocabularyToCategories: {
  //             include: {
  //               vocabulary: true,
  //             },
  //           },
  //         },
  //       }),
  //     ]);
  //     return { vocabulary, categories };
  //   } catch (error) {
  //     console.error('Error fetching vocabulary and categories:', error);
  //     throw new Error('Failed to fetch vocabulary and categories');
  //   }
  // }
  async findVocabularyCategory() {
    try {
      const [vocabulary, categories] = await Promise.all([
        this.prisma.vocabulary.findMany({
          include: {
            VocabularyToCategories: {
              include: {
                category: true,
              },
            },
          },
        }),
        this.prisma.categories.findMany({
          include: {
            _count: {
              select: { VocabularyToCategories: true },
            },
            VocabularyToCategories: {
              include: {
                vocabulary: true,
              },
            },
          },
        }),
      ]);

      // Transformation des catégories
      const transformedCategories = categories.map((category) => ({
        ...category,
        vocabulary: category.VocabularyToCategories.map(
          (vtc) => vtc.vocabulary,
        ),
        // On supprime la clé VocabularyToCategories si elle n'est plus utile
        VocabularyToCategories: undefined,
      }));

      return { vocabulary, categories: transformedCategories };
    } catch (error) {
      console.error('Error fetching vocabulary and categories:', error);
      throw new Error('Failed to fetch vocabulary and categories');
    }
  }

  async findOne(id: string) {
    try {
      const list = await this.prisma.lists.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          vocabularyItems: {
            include: {
              vocabulary: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
          _count: {
            select: {
              vocabularyItems: true,
            },
          },
        },
      });
      if (!list) {
        throw new NotFoundException(`List with ID ${id} not found`);
      }
      return list;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Error finding list with ID ${id}:`, error);
      throw new Error('Failed to find list');
    }
  }

  async updateDefaultList(userId: string) {
    try {
      // Find or create Complete List
      let completeList = await this.prisma.lists.findFirst({
        where: { name: 'Complete List', userId: userId },
      });
      if (!completeList) {
        completeList = await this.prisma.lists.create({
          data: {
            name: 'Complete List',
            description: 'Liste complète',
            userId: userId,
          },
        });
      }
      let knowList = await this.prisma.lists.findFirst({
        where: { name: 'Known List', userId: userId },
      });
      if (!knowList) {
        knowList = await this.prisma.lists.create({
          data: {
            name: 'Known List',
            description: 'Liste connue',
            userId: userId,
          },
        });
      }
      let unknownList = await this.prisma.lists.findFirst({
        where: { name: 'Unknown List', userId: userId },
      });
      if (!unknownList) {
        unknownList = await this.prisma.lists.create({
          data: {
            name: 'Unknown List',
            description: 'Liste inconnue',
            userId: userId,
          },
        });
      }

      const vocabularyProgress = await this.prisma.vocabularyProgress.findMany({
        where: { userId: userId },
      });

      for (const vocabulary of vocabularyProgress) {
        // Add to Known or Unknown List based on score
        const targetList = vocabulary.score >= 80 ? knowList : unknownList;
        await this.prisma.vocabularyList.upsert({
          where: {
            listId_vocabularyId: {
              listId: targetList.id,
              vocabularyId: vocabulary.vocabularyId,
            },
          },
          create: {
            listId: targetList.id,
            vocabularyId: vocabulary.vocabularyId,
            order: vocabulary.reviewNumber,
          },
          update: {
            order: vocabulary.reviewNumber,
          },
        });

        // Add to Complete List
        await this.prisma.vocabularyList.upsert({
          where: {
            listId_vocabularyId: {
              listId: completeList.id,
              vocabularyId: vocabulary.vocabularyId,
            },
          },
          create: {
            listId: completeList.id,
            vocabularyId: vocabulary.vocabularyId,
            order: vocabulary.reviewNumber,
          },
          update: {
            order: vocabulary.reviewNumber,
          },
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateListDto: UpdateListDto) {
    const { name, description, vocabulary = [] } = updateListDto;
    try {
      const existingList = await this.prisma.lists.findUnique({
        where: { id },
      });
      if (!existingList) {
        throw new NotFoundException(`List with ID ${id} not found`);
      }
      // Mise à jour des relations via VocabularyList
      await this.prisma.vocabularyList.deleteMany({
        where: { listId: id },
      });
      if (vocabulary.length > 0) {
        await this.prisma.vocabularyList.createMany({
          data: vocabulary.map((vocabularyId, index) => ({
            listId: id,
            vocabularyId,
            order: index,
          })),
        });
      }
      return await this.prisma.lists.update({
        where: { id },
        data: {
          name,
          description:
            description !== undefined ? description : existingList.description,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          vocabularyItems: {
            include: {
              vocabulary: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Error updating list with ID ${id}:`, error);
      throw new Error('Failed to update list');
    }
  }

  async remove(id: string) {
    try {
      const list = await this.prisma.lists.findUnique({
        where: { id },
      });
      if (!list) {
        throw new NotFoundException(`List with ID ${id} not found`);
      }
      await this.prisma.lists.delete({
        where: { id },
      });
      return { message: `List with ID ${id} has been deleted` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Error deleting list with ID ${id}:`, error);
      throw new Error('Failed to delete list');
    }
  }
}
