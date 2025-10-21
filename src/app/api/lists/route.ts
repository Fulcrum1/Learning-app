// app/api/lists/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const lists = await prisma.lists.findMany();

    return NextResponse.json(
      {
        message: "Liste des listes",
        lists: lists,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des listes:", error);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : "Une erreur est survenue lors de la récupération des listes",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, words } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
    }

    // Vérifier que les mots existent
    let wordIds: string[] = [];
    
    if (words && Array.isArray(words) && words.length > 0) {
      // S'assurer que nous avons bien des chaînes de caractères (IDs)
      wordIds = words
        .map(word => typeof word === 'string' ? word : word.id)
        .filter((id): id is string => Boolean(id)); // Filtrer les valeurs null/undefined
      
      if (wordIds.length > 0) {
        const existingWords = await prisma.words.findMany({
          where: {
            id: { in: wordIds },
          },
        });

        if (existingWords.length !== wordIds.length) {
          return NextResponse.json(
            { error: "Un ou plusieurs mots sélectionnés sont introuvables" },
            { status: 400 }
          );
        }
      }
    }

    const newList = await prisma.lists.create({
      data: {
        name,
        words: wordIds.length > 0
          ? {
              connect: wordIds.map(id => ({ id })),
            }
          : undefined,
      },
      include: {
        words: true,
      },
    });

    return NextResponse.json(
      {
        message: "Liste ajoutée avec succès",
        data: newList,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout de la liste:", error);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : "Une erreur est survenue lors de l'ajout de la liste",
      },
      { status: 500 }
    );
  }
}
