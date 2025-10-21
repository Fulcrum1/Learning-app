import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

// Types
type CreateUserInput = {
  email: string;
  name?: string;
  password: string;
  role?: string;
  phone?: string;
};

type UpdateUserInput = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  status?: "active" | "inactive";
  phone?: string;
};

// Fonctions du service
export const userService = {
  // Créer un nouvel utilisateur
  async createUser(data: CreateUserInput) {
    const hashedPassword = await hashPassword(data.password);

    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: data.role || "user",
        phone: data.phone,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        phone: true,
        createdAt: true,
      },
    });
  },

  // Récupérer un utilisateur par son ID
  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  // Récupérer un utilisateur par son email
  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  // Mettre à jour un utilisateur
  async updateUser(id: string, data: UpdateUserInput) {
    const updateData: Prisma.UserUpdateInput = { ...data };

    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        phone: true,
        updatedAt: true,
      },
    });
  },

  // Supprimer un utilisateur
  async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  },

  // Lister les utilisateurs avec pagination
  async listUsers({
    page = 1,
    limit = 10,
    search = "",
    status,
    role,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    role?: string;
  } = {}) {
    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status as "active" | "inactive";
    }

    if (role) {
      where.role = role;
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          phone: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: users,
    };
  },
};

// Fonction utilitaire pour hacher les mots de passe
async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs");
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Types d'export pour une meilleure expérience TypeScript
export type User = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    name: true;
    role: true;
    status: true;
    phone: true;
    createdAt: true;
    updatedAt: true;
  };
}>;
