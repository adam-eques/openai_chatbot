import express, { NextFunction, Request, Response } from 'express';
import { checkClientBody, checkClientQuery, checkModelBody } from '../../../middleware/checkParam';
import { loadOpenAI, loadOpenAIAssistant, openaiAssistantTools, prisma } from '../../../utils';

const router = express.Router();

router.route('/').get(checkClientQuery, async (req: Request, res: Response, _next: NextFunction) => {
  console.log(req.query)

  try {
    const clientName = req.query.client as string;

    const client = await prisma.client.findFirst({
      where: {
        name: clientName,
      }
    })

    if (client === null || typeof client === "undefined") {
      res.status(404).json({ error: "No such client" });
      return;
    }

    const assistant = await loadOpenAIAssistant(process.env.OPENAI_API_KEY, client.assistantId)

    res.send({
      success: true,
      assistantId: client.assistantId,
      model: assistant.model,
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({
      success: false,
      error: err
    });
  }
  // res.send("Chatbot OpenAI related Api v1");
})

router.route('/').post(checkClientBody, checkModelBody, async (req: Request, res: Response, _next: NextFunction) => {
  console.log(req.body)

  try {
    const clientName = req.body.client;
    const model = req.body.model;

    const client = await prisma.client.findFirst({
      where: {
        name: clientName,
      }
    })

    if (client === null || typeof client === "undefined") {
      res.status(404).json({ error: "No such client" });
      return;
    }

    const openai = loadOpenAI(process.env.OPENAI_API_KEY)
    const ares = await openai.beta.assistants.update(client.assistantId, {
      model: model,
      tools: openaiAssistantTools
    })

    res.send({
      success: true,
      assistantId: client.assistantId,
      model: ares.model,
      message: "Updated successfully"
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({
      success: false,
      error: err
    });
  }
  // res.send("Chatbot OpenAI related Api v1");
})

export default router;