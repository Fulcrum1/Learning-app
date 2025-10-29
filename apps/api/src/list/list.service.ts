import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createListDto: CreateListDto) {
    return this.createManual(createListDto);
  }

  async createManual(createListDto: CreateListDto) {
    const { name, description, userId, vocabulary = [], expressions = [] } = createListDto;

    // Vérification que le userId est fourni car il est requis dans le schéma
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

      // Création de la liste avec les relations
      return await this.prisma.lists.create({
        data: {
          name,
          description: description || '',
          userId,
          // Connexion directe des vocabulaires via la relation many-to-many
          vocabulary: vocabulary && vocabulary.length > 0 ? {
            connect: vocabulary.map(id => ({ id }))
          } : undefined,
          // Connexion directe des expressions via la relation many-to-many
          expressions: expressions && expressions.length > 0 ? {
            connect: expressions.map(id => ({ id }))
          } : undefined,
        },
        include: {
          vocabulary: true,
          expressions: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating list:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to create list');
    }
  }

  async createCategory(createListDto: CreateListDto) {
    const { name, description, userId } = createListDto;

    if (!userId) {
      throw new Error('User ID is required to create a category list');
    }

    try {
      return await this.prisma.lists.create({
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
              email: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating category list:', error);
      throw new Error('Failed to create category list');
    }
  }

  async createRandom(createListDto: CreateListDto) {
    const { name, description, userId } = createListDto;

    if (!userId) {
      throw new Error('User ID is required to create a random list');
    }

    try {
      return await this.prisma.lists.create({
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
              email: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating random list:', error);
      throw new Error('Failed to create random list');
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
              email: true
            }
          },
          _count: {
            select: {
              vocabulary: true,
              expressions: true
            }
          }
        }
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
        })
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
              email: true
            }
          },
          vocabulary: true,
          expressions: true,
          _count: {
            select: {
              vocabulary: true,
              expressions: true
            }
          }
        }
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
    const { name, description, vocabulary = [], expressions = [] } = updateListDto;

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
          description: description !== undefined ? description : existingList.description,
          // Mise à jour des relations many-to-many
          vocabulary: vocabulary ? {
            set: vocabulary.map(id => ({ id }))
          } : undefined,
          expressions: expressions ? {
            set: expressions.map(id => ({ id }))
          } : undefined,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          vocabulary: true,
          expressions: true
        }
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
