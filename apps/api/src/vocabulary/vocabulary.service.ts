import { Injectable } from '@nestjs/common';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VocabularyService {
  constructor(private prisma: PrismaService) {}

  createSingle(createVocabularyDto: CreateVocabularyDto) {
    const vocabulary = this.prisma.vocabulary.create({
      data: createVocabularyDto,
    });
    return vocabulary;
  }

  async createMultiple(createVocabularyDto: CreateVocabularyDto[]) {
    if (!Array.isArray(createVocabularyDto)) {
      throw new Error(
        'Le format des données est invalide : un tableau est attendu.',
      );
    }

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
      const categories = await this.handleCategories(vocabularyData.categoryNames);

      try {
        const newVocabulary = await this.prisma.vocabulary.create({
          data: {
            name: vocabularyData.name,
            translation: vocabularyData.translation,
            pronunciation: vocabularyData.pronunciation || null,
            categories: {
              connect: categories,
            },
          },
          include: {
            categories: true,
          },
        });
        // results.push(newVocabulary);
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

  findAll() {
    const vocabulary = this.prisma.vocabulary.findMany();
    return vocabulary;
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
