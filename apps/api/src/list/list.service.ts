import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreateProgressDto {
  vocabulary: string[];
  expressions: string[];
  userId: string;
}

@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createListDto: CreateListDto) {
    return this.createManual(createListDto);
  }

  async createProgress(createProgressDto: CreateProgressDto) {
    const { vocabulary, expressions, userId } = createProgressDto;
    
    if (vocabulary.length > 0) {
      // Vérifier les progressions existantes pour éviter les doublons
      const existingVocabProgress = await this.prisma.vocabularyProgress.findMany({
        where: {
          userId,
          vocabularyId: { in: vocabulary }
        },
        select: { vocabularyId: true }
      });

      // Filtrer les vocabulaires qui n'ont pas encore de progression
      const newVocabularies = vocabulary.filter(
        id => !existingVocabProgress.some(progress => progress.vocabularyId === id)
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

    if (expressions.length > 0) {
      // Vérifier les progressions existantes pour éviter les doublons
      const existingExprProgress = await this.prisma.expressionProgress.findMany({
        where: {
          userId,
          expressionId: { in: expressions }
        },
        select: { expressionId: true }
      });

      // Filtrer les expressions qui n'ont pas encore de progression
      const newExpressions = expressions.filter(
        id => !existingExprProgress.some(progress => progress.expressionId === id)
      );

      if (newExpressions.length > 0) {
        await this.prisma.expressionProgress.createMany({
          data: newExpressions.map((expressionId) => ({
            score: 0,
            lastReview: new Date(),
            expressionId,
            userId,
          })),
          skipDuplicates: true,
        });
      }
    }
  }

  async createManual(createListDto: CreateListDto) {
    const {
      name,
      description,
      userId,
      vocabulary = [],
      expressions = [],
    } = createListDto;
    
    if (!userId) {
      throw new Error('User ID is required to create a list');
    }
    
    try {
      // Vérifier que l'utilisateur existe
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Créer la progression pour les mots de vocabulaire et expressions
      await this.createProgress({
        vocabulary,
        expressions,
        userId,
      });

      // Création de la liste avec les relations
      const createdList = await this.prisma.lists.create({
        data: {
          name,
          description: description || '',
          userId,
          vocabulary: vocabulary.length > 0 ? {
            connect: vocabulary.map((id) => ({ id })),
          } : undefined,
          expressions: expressions.length > 0 ? {
            connect: expressions.map((id) => ({ id })),
          } : undefined,
        },
        include: {
          vocabulary: true,
          expressions: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return createdList;
    } catch (error) {
      console.error('Error creating list:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to create list: ' + error.message);
    }
  }

  async createCategory(createListDto: CreateListDto) {
    const { name, description, userId, vocabulary = [], expressions = [] } = createListDto;

    if (!userId) {
      throw new Error('User ID is required to create a category list');
    }

    try {
      // Vérifier que l'utilisateur existe
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Créer la progression pour les mots de vocabulaire et expressions
      await this.createProgress({
        vocabulary,
        expressions,
        userId,
      });

      // Créer la liste avec les relations
      return await this.prisma.lists.create({
        data: {
          name,
          description: description || '',
          userId,
          vocabulary: vocabulary.length > 0 ? {
            connect: vocabulary.map((id) => ({ id })),
          } : undefined,
          expressions: expressions.length > 0 ? {
            connect: expressions.map((id) => ({ id })),
          } : undefined,
        },
        include: {
          vocabulary: true,
          expressions: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error creating category list:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to create category list: ' + error.message);
    }
  }

  async createRandom(createListDto: CreateListDto) {
    const { name, description, userId, vocabulary = [], expressions = [] } = createListDto;

    if (!userId) {
      throw new Error('User ID is required to create a random list');
    }

    try {
      // Vérifier que l'utilisateur existe
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Créer la progression pour les mots de vocabulaire et expressions
      await this.createProgress({
        vocabulary,
        expressions,
        userId,
      });

      // Créer la liste avec les relations
      return await this.prisma.lists.create({
        data: {
          name,
          description: description || '',
          userId,
          vocabulary: vocabulary.length > 0 ? {
            connect: vocabulary.map((id) => ({ id })),
          } : undefined,
          expressions: expressions.length > 0 ? {
            connect: expressions.map((id) => ({ id })),
          } : undefined,
        },
        include: {
          vocabulary: true,
          expressions: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error creating random list:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to create random list: ' + error.message);
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
          _count: {
            select: {
              vocabulary: true,
              expressions: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching lists:', error);
      throw new Error('Failed to fetch lists');
    }
  }

  async findVocabularyCategory() {
    try {
      const [vocabulary, categories] = await Promise.all([
        this.prisma.vocabulary.findMany({
          include: {
            categories: true,
          },
        }),
        this.prisma.categories.findMany({
          include: {
            _count: {
              select: { vocabulary: true },
            },
          },
        }),
      ]);

      return { vocabulary, categories };
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
          vocabulary: true,
          expressions: true,
          _count: {
            select: {
              vocabulary: true,
              expressions: true,
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

  async update(id: string, updateListDto: UpdateListDto) {
    const {
      name,
      description,
      vocabulary = [],
      expressions = [],
    } = updateListDto;

    try {
      // Vérifier que la liste existe
      const existingList = await this.prisma.lists.findUnique({
        where: { id },
      });

      if (!existingList) {
        throw new NotFoundException(`List with ID ${id} not found`);
      }

      // Mise à jour de la liste avec les relations
      return await this.prisma.lists.update({
        where: { id },
        data: {
          name,
          description:
            description !== undefined ? description : existingList.description,
          // Mise à jour des relations many-to-many
          vocabulary: vocabulary
            ? {
                set: vocabulary.map((id) => ({ id })),
              }
            : undefined,
          expressions: expressions
            ? {
                set: expressions.map((id) => ({ id })),
              }
            : undefined,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          vocabulary: true,
          expressions: true,
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
      // Vérifier que la liste existe
      const list = await this.prisma.lists.findUnique({
        where: { id },
      });

      if (!list) {
        throw new NotFoundException(`List with ID ${id} not found`);
      }

      // Supprimer la liste
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
