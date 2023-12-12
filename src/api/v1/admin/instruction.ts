import express, { NextFunction, Request, Response } from 'express';
import { loadOpenAI, loadOpenAIAssistant, prisma } from '../../../utils';

const router = express.Router();

router.route('/').get(async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
  const clientName = req.body.client;

  const client = await prisma.client.findFirst({
    where: {
      name: clientName,
    }
  }).catch((reason) => {
    console.error(reason);
  });

  if (client === null || typeof client === "undefined") {
    res.status(404).json({ error: "No such client" });
    return;
  }

  let assistant = await loadOpenAIAssistant(process.env.OPENAI_API_KEY || "", client.assistantId)
  res.send({
    assistantId: assistant.id,
    instuction: assistant.instructions,
  })
  // res.send("Chatbot OpenAI related Api v1");
})

router.route('/').post(async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
  const clientName = req.body.client;
  const instruction = req.body.instuction;

  if (!clientName) {
    res.status(404).json({ error: "No such client" });
    return;
  }

  const client = await prisma.client.findFirst({
    where: {
      name: clientName,
    }
  }).catch((reason) => {
    console.error(reason);
  });

  if (client === null || typeof client === "undefined") {
    res.status(404).json({ error: "No such client" });
    return;
  }

  const openai = loadOpenAI(process.env.OPENAI_API_KEY)
  const ares = await openai.beta.assistants.update(client.assistantId, {
    instructions: instruction,
  })

  console.log(ares)

  res.send({
    success: true,
    assistantId: client.assistantId,
    message: "Updated successfully"
  })
  // res.send("Chatbot OpenAI related Api v1");
})

export default router;