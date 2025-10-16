import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Création d'une instance de PrismaClient ou réutilisation d'une existante
const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// En mode développement, on garde une seule instance du client
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
