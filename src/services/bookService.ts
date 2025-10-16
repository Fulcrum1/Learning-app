import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

// Types
type CreateBookInput = {
  title: string;
  author: string;
  category: string;
  description?: string;
  isbn?: string;
  publishedAt?: Date | string;
};

type UpdateBookInput = {
  title?: string;
  author?: string;
  category?: string;
  description?: string | null;
  isbn?: string | null;
  publishedAt?: Date | string | null;
};

// Fonctions du service
export const bookService = {
  // Créer un nouveau livre
  async createBook(data: CreateBookInput) {
    return prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        category: data.category,
        description: data.description,
        isbn: data.isbn,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      },
    });
  },

  // Récupérer un livre par son ID
  async getBookById(id: string) {
    return prisma.book.findUnique({
      where: { id },
    });
  },

  // Mettre à jour un livre
  async updateBook(id: string, data: UpdateBookInput) {
    const updateData: Prisma.BookUpdateInput = { ...data };
    
    if (data.publishedAt) {
      updateData.publishedAt = new Date(data.publishedAt);
    }

    return prisma.book.update({
      where: { id },
      data: updateData,
    });
  },

  // Supprimer un livre
  async deleteBook(id: string) {
    return prisma.book.delete({
      where: { id },
    });
  },

  // Lister les livres avec pagination et filtres
  async listBooks({
    page = 1,
    limit = 10,
    search = '',
    category,
    author,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    author?: string;
  } = {}) {
    const where: Prisma.BookWhereInput = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (category) {
      where.category = category;
    }
    
    if (author) {
      where.author = author;
    }

    const [total, books] = await Promise.all([
      prisma.book.count({ where }),
      prisma.book.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { title: 'asc' },
      }),
    ]);

    return {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: books,
    };
  },

  // Obtenir toutes les catégories uniques
  async getCategories() {
    return prisma.book.findMany({
      distinct: ['category'],
      select: {
        category: true,
      },
      orderBy: {
        category: 'asc',
      },
    });
  },

  // Obtenir tous les auteurs uniques
  async getAuthors() {
    return prisma.book.findMany({
      distinct: ['author'],
      select: {
        author: true,
      },
      orderBy: {
        author: 'asc',
      },
    });
  },
};

// Types d'export pour une meilleure expérience TypeScript
export type Book = Prisma.BookGetPayload<{}>;
