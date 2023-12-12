import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
  await prisma.$connect().then(async (res) => {
    console.log('DB connection established')
  })
})();

export default prisma;