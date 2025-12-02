import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const fr = await prisma.language.upsert({
    where: { code: 'fr' },
    update: {},
    create: {
      code: 'fr',
      name: 'Français',
    },
  });
  const en = await prisma.language.upsert({
    where: { code: 'en' },
    update: {},
    create: {
      code: 'en',
      name: 'English',
    },
  });
  const jp = await prisma.language.upsert({
    where: { code: 'jp' },
    update: {},
    create: {
      code: 'jp',
      name: 'Japanese',
    },
  });
  console.log({ fr, en, jp });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
