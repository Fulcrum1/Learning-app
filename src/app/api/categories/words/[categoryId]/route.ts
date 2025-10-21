// app/api/categories/words/[categoryId]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { categoryId } = params;
    if (!categoryId) {
      return NextResponse.json(
        { error: "Le paramètre categoryId est requis" },
        { status: 400 }
      );
    }

    const words = await prisma.words.findMany({
      where: {
        categories: {
          some: {
            id: categoryId,
          },
        },
      },
      select: {
        id: true,
        word: true,
        translation: true,
        pronunciation: true,
        categories: true,
        // Ajoutez d'autres champs si nécessaire
      },
    });

    return NextResponse.json(words);
  } catch (error) {
    console.error("Erreur lors de la récupération des mots:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des mots" },
      { status: 500 }
    );
  }
}
