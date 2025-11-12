import { Injectable } from '@nestjs/common';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VocabularyService {
  constructor(private prisma: PrismaService) {}

  createSingle(createVocabularyDto: CreateVocabularyDto) {
    const vocabulary = this.prisma.vocabulary.create({
      data: createVocabularyDto,
    });
    return vocabulary;
  }

  // Create multiple vocabularies
  async createMultiple(createVocabularyDto: CreateVocabularyDto[], userId: string) {
    if (!Array.isArray(createVocabularyDto)) {
      throw new Error(
        'Le format des données est invalide : un tableau est attendu.',
      );
    }
    // Find or create Complete List
    let completeList = await this.prisma.lists.findFirst({
      where: {
        name: 'Complete List',
        userId: userId,
      }
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

    // Find or create Unknown List
    let unknownList = await this.prisma.lists.findFirst({
      where: {
        name: 'Unknown List',
        userId: userId,
      },
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

    // Find last order of Complete List
    let lastOrderCompleteList = await this.prisma.vocabularyList.findFirst({
      where: {
        listId: completeList.id,
      },
      orderBy: {
        order: 'desc',
      },
    });

    // Find last order of Unknown List
    let lastOrderUnknownList = await this.prisma.vocabularyList.findFirst({
      where: {
        listId: unknownList.id,
      },
      orderBy: {
        order: 'desc',
      },
    });

    let orderCompleteList = lastOrderCompleteList?.order || 1;
    let orderUnknownList = lastOrderUnknownList?.order || 1;

    const results = [];

    for (const vocabularyData of createVocabularyDto) {
      if (!vocabularyData.name || !vocabularyData.translation) {
        console.warn(
          'Vocabulaire ignoré : mot ou traduction manquant',
          vocabularyData,
        );
        continue;
      }

      // Gérer les catégories pour chaque vocabulaire
      const categories = await this.handleCategories(
        vocabularyData.categoryNames,
      );

      try {
        // Create new vocabulary
        const newVocabulary = await this.prisma.vocabulary.create({
          data: {
            name: vocabularyData.name,
            translation: vocabularyData.translation,
            pronunciation: vocabularyData.pronunciation || null,
          },
        });

        orderCompleteList += 1;
        orderUnknownList += 1;

        // Update Complete List
        const updateCompleteList = await this.prisma.vocabularyList.create({
          data: {
            vocabularyId: newVocabulary.id,
            listId: completeList.id,
            order: orderCompleteList,
          },
        });

        // Update Unknown List
        const updateUnknownList = await this.prisma.vocabularyList.create({
          data: {
            vocabularyId: newVocabulary.id,
            listId: unknownList.id,
            order: orderUnknownList,
          },
        });

        // Update Vocabulary Categories
        const newVocabularyCategories =
          await this.prisma.vocabularyToCategories.createMany({
            data: categories.map((category) => ({
              vocabularyId: newVocabulary.id,
              categoryId: category.id,
            })),
          });
      } catch (error) {
        console.error(
          "Erreur lors de l'ajout du vocabulaire :",
          vocabularyData,
          error,
        );
        // On continue avec les vocabulaires suivants même en cas d'erreur
      }
    }

    return results;
  }

  async handleCategories(
    categoryNames: string[] = [],
  ): Promise<{ id: string }[]> {
    const resultCategories: { id: string }[] = [];
    const allCategories = await this.prisma.categories.findMany();

    for (const name of categoryNames) {
      if (!name) continue;

      // Vérifier si la catégorie existe déjà (insensible à la casse)
      const existingCategory = allCategories.find(
        (cat) => cat.name.toLowerCase() === name.toLowerCase(),
      );

      let categoryId: string;

      // Si elle n'existe pas, on la crée
      if (!existingCategory) {
        const newCategory = await this.prisma.categories.create({
          data: { name },
        });
        categoryId = newCategory.id;
        allCategories.push(newCategory); // Ajouter à la liste pour les prochaines itérations
      } else {
        categoryId = existingCategory.id;
      }

      resultCategories.push({ id: categoryId });
    }

    return resultCategories;
  }

  async findAll() {
    const vocabulary = await this.prisma.vocabulary.findMany();
    const knowVocabulary = await this.prisma.vocabularyProgress.findMany({
      where: {
        score: {
          gte: 80,
        },
      },
      select: {
        vocabularyId: true,
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
        vocabularyId: true,
      },
    });

    const unknownVocabulary = await this.prisma.vocabularyProgress.findMany({
      where: {
        score: {
          lt: 20,
        },
      },
      select: {
        vocabularyId: true,
      },
    });
    return { vocabulary, knowVocabulary, learnVocabulary, unknownVocabulary };
  }

  findOne(id: string) {
    const vocabulary = this.prisma.vocabulary.findUnique({
      where: {
        id: id,
      },
    });
    return vocabulary;
  }

  update(id: string, updateVocabularyDto: UpdateVocabularyDto) {
    const vocabulary = this.prisma.vocabulary.update({
      where: {
        id: id,
      },
      data: updateVocabularyDto,
    });
    return vocabulary;
  }

  remove(id: string) {
    const vocabulary = this.prisma.vocabulary.delete({
      where: {
        id: id,
      },
    });
    return vocabulary;
  }
}
