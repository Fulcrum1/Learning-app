// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json();

        // 1. Validation des champs obligatoires
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis' },
                { status: 400 }
            );
        }

        // 2. Validation du format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Format d\'email invalide' },
                { status: 400 }
            );
        }

        // 3. Validation de la complexité du mot de passe
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json(
                { error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre' },
                { status: 400 }
            );
        }

        // 4. Vérification de l'existence de l'utilisateur
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return NextResponse.json(
                { error: 'Un compte existe déjà avec cet email' },
                { status: 409 }
            );
        }

        // 5. Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // 6. Création de l'utilisateur en base de données
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'USER', // Rôle par défaut
            },
        });

        // 7. Réponse réussie (sans retourner le mot de passe)
        return NextResponse.json(
            {
                message: 'Compte créé avec succès',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            },
            { status: 201 }
        );

    } catch (error) {
        // 8. Gestion des erreurs
        console.error('Erreur lors de l\'inscription:', error);
        return NextResponse.json(
            {
                error: process.env.NODE_ENV === 'development'
                    ? (error as Error).message
                    : 'Une erreur est survenue lors de l\'inscription'
            },
            { status: 500 }
        );
    }
}
