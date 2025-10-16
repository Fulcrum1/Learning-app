// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        // const { user } = await request.json();

        // 4. Vérification de l'existence de l'utilisateur
        const users = await prisma.user.findMany()

        // 7. Réponse réussie (sans retourner le mot de passe)
        return NextResponse.json(
            {
                message: 'Liste des utilisateurs',
                users: users,
            },
            { status: 200 }
        );

    } catch (error) {
        // 8. Gestion des erreurs
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        return NextResponse.json(
            {
                error: process.env.NODE_ENV === 'development'
                    ? (error as Error).message
                    : 'Une erreur est survenue lors de la récupération des utilisateurs'
            },
            { status: 500 }
        );
    }
}
