// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const categories = await prisma.categories.findMany()
        
        return NextResponse.json(
            {
                message: 'Liste des categories',
                categories: categories,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur lors de la récupération des categories:', error);
        return NextResponse.json(
            {
                error: process.env.NODE_ENV === 'development'
                    ? (error as Error).message
                    : 'Une erreur est survenue lors de la récupération des categories'
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { name } = await request.json();
        
        if (!name) {
            return NextResponse.json(
                { error: 'Le nom est requis' },
                { status: 400 }
            );
        }

        const newList = await prisma.categories.create({
            data: {
                name,
            },
        });

        return NextResponse.json(
            {
                message: 'Catégorie ajoutée avec succès',
                data: newList,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Erreur lors de l\'ajout de la catégorie:', error);
        return NextResponse.json(
            {
                error: process.env.NODE_ENV === 'development'
                    ? (error as Error).message
                    : 'Une erreur est survenue lors de l\'ajout de la catégorie'
            },
            { status: 500 }
        );
    }
}
