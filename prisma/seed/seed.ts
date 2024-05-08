import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const roles = await prisma.role.createMany({
    data: [
      {
        value: 'OWNER',
      },
      {
        value: 'ADMIN',
      },
      {
        value: 'MANAGER',
      },
      {
        value: 'EMPLOYEE',
      },
    ],
  });
  const shopTypes = await prisma.shopType.createMany({
    data: [
      {
        value: 'RESTAURANT',
      },
    ],
  });
  return { roles, shopTypes };
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
