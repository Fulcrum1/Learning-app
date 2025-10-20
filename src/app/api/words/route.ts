// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const words = await prisma.words.findMany()
        
        return NextResponse.json(
            {
                message: 'Liste des mots',
                words: words,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur lors de la récupération des mots:', error);
        return NextResponse.json(
            {
                error: process.env.NODE_ENV === 'development'
                    ? (error as Error).message
                    : 'Une erreur est survenue lors de la récupération des mots'
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { word, translation, pronunciation } = await request.json();
        
        if (!word || !translation) {
            return NextResponse.json(
                { error: 'Le mot et la traduction sont requis' },
                { status: 400 }
            );
        }

        const newWord = await prisma.words.create({
            data: {
                word,
                translation,
                pronunciation: pronunciation || null,
            },
        });

        return NextResponse.json(
            {
                message: 'Mot ajouté avec succès',
                data: newWord,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Erreur lors de l\'ajout du mot:', error);
        return NextResponse.json(
            {
                error: process.env.NODE_ENV === 'development'
                    ? (error as Error).message
                    : 'Une erreur est survenue lors de l\'ajout du mot'
            },
            { status: 500 }
        );
    }
}
