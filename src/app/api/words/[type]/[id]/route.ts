import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Word = {
  id: string;
  word: string;
  translation: string;
  pronunciation: string | null;
  categories?: Array<{ id: string; name: string }>;
  lists?: Array<{ id: string; name: string }>;
};

interface RouteParams {
  params: { type: string; id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { type, id } = params;

    if (!id) {
      return NextResponse.json({ error: "L'ID est requis" }, { status: 400 });
    }

    if (type !== "categories" && type !== "lists") {
      return NextResponse.json(
        {
          error:
            "Type de ressource non valide. Utilisez 'categories' ou 'lists'",
        },
        { status: 400 }
      );
    }

    let words: Word[] = [];

    if (type === "categories") {
      // Récupérer les mots d'une catégorie
      const category = await prisma.categories.findUnique({
        where: { id },
        include: {
          words: {
            select: {
              id: true,
              word: true,
              translation: true,
              pronunciation: true,
            },
          },
        },
      });

      if (category) {
        words = category.words.map((word) => ({
          ...word,
          categories: [{ id: category.id, name: category.name }],
        }));
      }
    } else if (type === "lists") {
      // Récupérer les mots d'une liste
      const list = await prisma.lists.findUnique({
        where: { id },
        include: {
          words: {
            select: {
              id: true,
              word: true,
              translation: true,
              pronunciation: true,
            },
          },
        },
      });

      if (list) {
        words = list.words.map((word) => ({
          ...word,
          lists: [{ id: list.id, name: list.name }],
        }));
      }
    }

    return NextResponse.json(words);
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des mots pour ${type}:`,
      error
    );
    return NextResponse.json(
      { error: `Erreur lors de la récupération des mots` },
      { status: 500 }
    );
  }
}
