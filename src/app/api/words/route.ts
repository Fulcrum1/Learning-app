// app/api/words/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Word, CreateWordDto } from "@/types/word";

export async function GET(request: Request) {
  try {
    // Récupérer les mots avec leurs catégories associées
    const words = await prisma.words.findMany({
      include: {
        categories: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Récupérer toutes les catégories disponibles
    const allCategories = await prisma.categories.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    // Formater la réponse pour inclure les catégories avec les mots
    const formattedWords = words.map(word => ({
      ...word,
      categories: word.categories || []
    }));
    
    return NextResponse.json(
      {
        message: "Liste des mots avec leurs catégories",
        words: formattedWords,
        categories: allCategories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des mots:", error);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : "Une erreur est survenue lors de la récupération des mots",
      },
      { status: 500 }
    );
  }
}

// Fonction utilitaire pour gérer la création/mise à jour des catégories
async function handleCategories(categoryNames: string[] = []): Promise<{id: string}[]> {
  const resultCategories: {id: string}[] = [];
  const allCategories = await prisma.categories.findMany();
  
  for (const name of categoryNames) {
    if (!name) continue;
    
    // Vérifier si la catégorie existe déjà (insensible à la casse)
    const existingCategory = allCategories.find(cat => 
      cat.name.toLowerCase() === name.toLowerCase()
    );

    let categoryId: string;
    
    // Si elle n'existe pas, on la crée
    if (!existingCategory) {
      const newCategory = await prisma.categories.create({
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type_post } = body;

    if (type_post === "single") {
      const { word, translation, pronunciation, categoryNames = [] } = body;
      
      if (!word || !translation) {
        return NextResponse.json(
          { error: "Le mot et la traduction sont requis" },
          { status: 400 }
        );
      }

      // Gérer les catégories
      const categories = await handleCategories(categoryNames);

      const newWord = await prisma.words.create({
        data: {
          word,
          translation,
          pronunciation: pronunciation || null,
          categories: {
            connect: categories,
          },
        },
        include: {
          categories: true,
        },
      });

      return NextResponse.json(
        {
          message: "Mot ajouté avec succès",
          data: newWord,
        },
        { status: 201 }
      );
    } 
    
    if (type_post === "bulk") {
      const { words } = body as { words: CreateWordDto[] };
      
      if (!Array.isArray(words)) {
        return NextResponse.json(
          { error: "Le format des données est invalide" },
          { status: 400 }
        );
      }

      const results = [];
      
      for (const wordData of words) {
        if (!wordData.word || !wordData.translation) {
          console.warn("Mot ignoré: mot ou traduction manquant", wordData);
          continue;
        }

        // Gérer les catégories pour chaque mot
        const categories = await handleCategories(wordData.categoryNames);

        try {
          const newWord = await prisma.words.create({
            data: {
              word: wordData.word,
              translation: wordData.translation,
              pronunciation: wordData.pronunciation || null,
              categories: {
                connect: categories,
              },
            },
            include: {
              categories: true,
            },
          });
          results.push(newWord);
        } catch (error) {
          console.error("Erreur lors de l'ajout du mot:", wordData, error);
          // On continue avec les mots suivants même en cas d'erreur
        }
      }

      return NextResponse.json(
        {
          message: `${results.length} mots ajoutés avec succès`,
          data: results,
          warnings: results.length < words.length 
            ? `${words.length - results.length} mots n'ont pas pu être ajoutés` 
            : undefined,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: "Type de requête invalide" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout des mots:", error);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : "Une erreur est survenue lors de l'ajout des mots",
      },
      { status: 500 }
    );
  }
}
