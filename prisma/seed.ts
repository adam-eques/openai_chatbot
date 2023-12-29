import { PrismaClient } from '@prisma/client';
import { loadOpenAIAssistant } from '../src/utils';
import { createTable } from '../src/utils/airtables';
const prisma = new PrismaClient()
async function main() {
  const atbToken = "pat49tWyYSd5wejEM.8bf15fe554cce19b5a380718ae5d248c62140263fbf9fd8f9a3b0d3eacf0068d"
  const atbBaseId = "appBTHW4e1DXYYFj9"
  const atbTableNM = "leadInfo_1"
  let atbTableId = "test"
  try {
    const res = await createTable(atbToken, atbBaseId, atbTableNM)
    atbTableId = res.data.id
    console.log(res.data)
  } catch (error) {
    console.log(error?.response?.data)
    console.log(error?.response)
    console.error("Failed to insert test data")
    return
  }
  const testClient = await prisma.client.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "client1",
      assistantId: "asst_gleK1Z1Tw3P8RU06X7Z5sBlB",
      atbToken: atbToken,
      atbBaseId: atbBaseId,
      atbTableNM: atbTableNM,
      atbTableId: atbTableId,
    }
  });
  console.log({ testClient })

  if (typeof process.env.OPENAI_API_KEY !== "string") return
  for (let index = 2; index <= 11; index++) {
    const clientName = `client${index}`
    const atbToken = "pat49tWyYSd5wejEM.8bf15fe554cce19b5a380718ae5d248c62140263fbf9fd8f9a3b0d3eacf0068d"
    const atbBaseId = "appBTHW4e1DXYYFj9"
    const atbTableNM = `leadInfo_${index}`
    let atbTableId = "test"
    try {
      const res = await createTable(atbToken, atbBaseId, atbTableNM)
      atbTableId = res.data.id
      console.log(res.data)
    } catch (error) {
      console.log(error?.response?.data)
      console.log(error?.response)
      console.error("Failed to insert test data")
      return
    }

    const assistant = await loadOpenAIAssistant(process.env.OPENAI_API_KEY, "")
    const testClient = await prisma.client.upsert({
      where: { id: index },
      update: {},
      create: {
        name: clientName,
        assistantId: assistant.id,
        atbToken: atbToken,
        atbBaseId: atbBaseId,
        atbTableNM: atbTableNM,
        atbTableId: atbTableId,
      }
    });
    console.log({ testClient })
  }
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