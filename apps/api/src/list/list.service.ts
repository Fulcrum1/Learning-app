// import { Injectable, NotFoundException } from '@nestjs/common';
// import { CreateListDto } from './dto/create-list.dto';
// import { UpdateListDto } from './dto/update-list.dto';
// import { PrismaService } from 'src/prisma/prisma.service';

// interface CreateProgressDto {
//   vocabulary: string[];
//   userId: string;
// }

// @Injectable()
// export class ListService {
//   constructor(private readonly prisma: PrismaService) {}

//   async create(createListDto: CreateListDto) {
//     return this.createManual(createListDto);
//   }

//   async createProgress(createProgressDto: CreateProgressDto) {
//     const { vocabulary, userId } = createProgressDto;

//     if (vocabulary.length > 0) {
//       // Vérifier les progressions existantes pour éviter les doublons
//       const existingVocabProgress = await this.prisma.vocabularyProgress.findMany({
//         where: {
//           userId,
//           vocabularyId: { in: vocabulary }
//         },
//         select: { vocabularyId: true }
//       });

//       // Filtrer les vocabulaires qui n'ont pas encore de progression
//       const newVocabularies = vocabulary.filter(
//         id => !existingVocabProgress.some(progress => progress.vocabularyId === id)
//       );

//       if (newVocabularies.length > 0) {
//         await this.prisma.vocabularyProgress.createMany({
//           data: newVocabularies.map((vocabularyId) => ({
//             score: 0,
//             lastReview: new Date(),
//             vocabularyId,
//             userId,
//           })),
//           skipDuplicates: true,
//         });
//       }
//     }

//   }

//   async createManual(createListDto: CreateListDto) {
//     const {
//       name,
//       description,
//       userId,
//       vocabulary = [],
//     } = createListDto;

//     if (!userId) {
//       throw new Error('User ID is required to create a list');
//     }

//     try {
//       // Vérifier que l'utilisateur existe
//       const user = await this.prisma.user.findUnique({
//         where: { id: userId },
//       });

//       if (!user) {
//         throw new NotFoundException(`User with ID ${userId} not found`);
//       }

//       // Créer la progression pour les mots de vocabulaire
//       await this.createProgress({
//         vocabulary,
//         userId,
//       });

//       // Création de la liste avec les relations
//       const createdList = await this.prisma.lists.create({
//         data: {
//           name,
//           description: description || '',
//           userId,
//           // vocabulary: vocabulary.length > 0 ? {
//           //   connect: vocabulary.map((id) => ({ id })),
//           // } : undefined,
//         },
//         include: {
//           // vocabulary: true,
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//             },
//           },
//         },
//       });

//       const createdListVocabulary = await this.prisma.vocabularyList.createMany({
//         data: vocabulary.map((vocabularyId, index) => ({
//           listId: createdList.id,
//           vocabularyId,
//           order: index,
//         })),
//       });

//       return createdList;
//     } catch (error) {
//       console.error('Error creating list:', error);
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       throw new Error('Failed to create list: ' + error.message);
//     }
//   }

//   async createCategory(createListDto: CreateListDto) {
//     const { name, description, userId, vocabulary = [] } = createListDto;

//     if (!userId) {
//       throw new Error('User ID is required to create a category list');
//     }

//     try {
//       // Vérifier que l'utilisateur existe
//       const user = await this.prisma.user.findUnique({
//         where: { id: userId },
//       });

//       if (!user) {
//         throw new NotFoundException(`User with ID ${userId} not found`);
//       }

//       // Créer la progression pour les mots de vocabulaire
//       await this.createProgress({
//         vocabulary,
//         userId,
//       });

//       // Créer la liste avec les relations
//       const createdList = await this.prisma.lists.create({
//         data: {
//           name,
//           description: description || '',
//           userId,
//           // vocabulary: vocabulary.length > 0 ? {
//           //   connect: vocabulary.map((id) => ({ id })),
//           // } : undefined,
//         },
//         include: {
//           // vocabulary: true,
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//             },
//           },
//         },
//       });

//       const createdListVocabulary = await this.prisma.vocabularyList.createMany({
//         data: vocabulary.map((vocabularyId, index) => ({
//           listId: createdList.id,
//           vocabularyId,
//           order: index,
//         })),
//       });

//       return createdList;
//     } catch (error) {
//       console.error('Error creating category list:', error);
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       throw new Error('Failed to create category list: ' + error.message);
//     }
//   }

//   async createRandom(createListDto: CreateListDto) {
//     const { name, description, userId, vocabulary = [] } = createListDto;

//     if (!userId) {
//       throw new Error('User ID is required to create a random list');
//     }

//     try {
//       // Vérifier que l'utilisateur existe
//       const user = await this.prisma.user.findUnique({
//         where: { id: userId },
//       });

//       if (!user) {
//         throw new NotFoundException(`User with ID ${userId} not found`);
//       }

//       // Créer la progression pour les mots de vocabulaire
//       await this.createProgress({
//         vocabulary,
//         userId,
//       });

//       // Créer la liste avec les relations
//       const createdList = await this.prisma.lists.create({
//         data: {
//           name,
//           description: description || '',
//           userId,
//           // vocabulary: vocabulary.length > 0 ? {
//           //   connect: vocabulary.map((id) => ({ id })),
//           // } : undefined,
//         },
//         include: {
//           // vocabulary: true,
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//             },
//           },
//         },
//       });

//       const createdListVocabulary = await this.prisma.vocabularyList.createMany({
//         data: vocabulary.map((vocabularyId, index) => ({
//           listId: createdList.id,
//           vocabularyId,
//           order: index,
//         })),
//       });

//       return createdList;
//     } catch (error) {
//       console.error('Error creating random list:', error);
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       throw new Error('Failed to create random list: ' + error.message);
//     }
//   }

//   async findAll() {
//     try {
//       const lists = await this.prisma.lists.findMany({
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//             },
//           },
//           _count: {
//             select: {
//               vocabulary: true,
//             },
//           },
//         },
//       });

//       const listsVocabulary = await this.prisma.vocabularyList.findMany({
//         include: {
//           list: true,
//           vocabulary: true,
//         },
//       });

//       return { lists, listsVocabulary };
//     } catch (error) {
//       console.error('Error fetching lists:', error);
//       throw new Error('Failed to fetch lists');
//     }
//   }

//   async findVocabularyCategory() {
//     try {
//       const [vocabulary, categories] = await Promise.all([
//         this.prisma.vocabulary.findMany({
//           include: {
//             categories: true,
//           },
//         }),
//         this.prisma.categories.findMany({
//           include: {
//             _count: {
//               select: { vocabulary: true },
//             },
//           },
//         }),
//       ]);

//       return { vocabulary, categories };
//     } catch (error) {
//       console.error('Error fetching vocabulary and categories:', error);
//       throw new Error('Failed to fetch vocabulary and categories');
//     }
//   }

//   async findVocabularyCard(id: string) {
//     try {
//       const [vocabulary] = await Promise.all([
//         this.prisma.vocabulary.findMany({
//           where: { lists: { some: { id } } },
//           include: {
//             categories: true,
//           },
//         }),
//       ]);

//       return { vocabulary };
//     } catch (error) {
//       console.error('Error fetching vocabulary:', error);
//       throw new Error('Failed to fetch vocabulary');
//     }
//   }

//   async findOne(id: string) {
//     try {
//       const list = await this.prisma.lists.findUnique({
//         where: { id },
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//             },
//           },
//           vocabulary: true,
//           _count: {
//             select: {
//               vocabulary: true,
//             },
//           },
//         },
//       });

//       if (!list) {
//         throw new NotFoundException(`List with ID ${id} not found`);
//       }

//       return list;
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       console.error(`Error finding list with ID ${id}:`, error);
//       throw new Error('Failed to find list');
//     }
//   }

//   async update(id: string, updateListDto: UpdateListDto) {
//     const {
//       name,
//       description,
//       vocabulary = [],
//     } = updateListDto;

//     try {
//       // Vérifier que la liste existe
//       const existingList = await this.prisma.lists.findUnique({
//         where: { id },
//       });

//       if (!existingList) {
//         throw new NotFoundException(`List with ID ${id} not found`);
//       }

//       // Mise à jour de la liste avec les relations
//       return await this.prisma.lists.update({
//         where: { id },
//         data: {
//           name,
//           description:
//             description !== undefined ? description : existingList.description,
//           // Mise à jour des relations many-to-many
//           vocabulary: vocabulary
//             ? {
//                 set: vocabulary.map((id) => ({ id })),
//               }
//             : undefined,
//         },
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//             },
//           },
//           vocabulary: true,
//         },
//       });
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       console.error(`Error updating list with ID ${id}:`, error);
//       throw new Error('Failed to update list');
//     }
//   }

//   async remove(id: string) {
//     try {
//       // Vérifier que la liste existe
//       const list = await this.prisma.lists.findUnique({
//         where: { id },
//       });

//       if (!list) {
//         throw new NotFoundException(`List with ID ${id} not found`);
//       }

//       // Supprimer la liste
//       await this.prisma.lists.delete({
//         where: { id },
//       });

//       return { message: `List with ID ${id} has been deleted` };
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       console.error(`Error deleting list with ID ${id}:`, error);
//       throw new Error('Failed to delete list');
//     }
//   }
// }
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
          VocabularyList: {
            include: {
              vocabulary: true,
            },
          },
          _count: {
            select: {
              VocabularyList: true,
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

  async findVocabularyCard(listId: string, reset: boolean | undefined) {
    try {
      const vocabularyList = await this.prisma.vocabularyList.findMany({
        where: { listId },
        include: {
          vocabulary: {
            include: {
              VocabularyToCategories: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      });
      return {
        vocabulary: vocabularyList.map((vl) => vl.vocabulary),
      };
    } catch (error) {
      console.error('Error fetching vocabulary cards:', error);
      throw new Error('Failed to fetch vocabulary cards');
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
          VocabularyList: {
            include: {
              vocabulary: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
          _count: {
            select: {
              VocabularyList: true,
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
          VocabularyList: {
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
