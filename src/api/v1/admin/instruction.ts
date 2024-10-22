import express, { NextFunction, Request, Response } from 'express';
import { checkClientBody, checkClientQuery, checkInstructionBody } from '../../../middleware/checkParam';
import { loadOpenAI, loadOpenAIAssistant, prisma } from '../../../utils';

const router = express.Router();

router.route('/').get(checkClientQuery, async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
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

    let assistant = await loadOpenAIAssistant(process.env.OPENAI_API_KEY || "", client.assistantId)
    res.send({
      assistantId: assistant.id,
      instruction: assistant.instructions,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send()
  }
  // res.send("Chatbot OpenAI related Api v1");
})

router.route('/').post(checkClientBody, checkInstructionBody, async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
  console.log(req.body)

  const clientName = req.body.client;
  const instruction = req.body.instruction;

  try {
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
  } catch (error) {
    console.error(error)
    res.status(500).send()
  }
  // res.send("Chatbot OpenAI related Api v1");
})

export default router;