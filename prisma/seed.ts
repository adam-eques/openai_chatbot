import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()
async function main() {
  const testClient = await prisma.client.upsert({
    where: { id: 0 },
    update: {},
    create: {
      name: "client1",
      assistantId: "asst_gleK1Z1Tw3P8RU06X7Z5sBlB",
    }
  });
  console.log({ testClient })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })