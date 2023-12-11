import express, { NextFunction, Request, Response } from 'express';
import { loadOpenAIAssistant, prisma } from '../../../utils';

const router = express.Router();

router.route('/').get(async (_req: Request, res: Response, _next: NextFunction): Promise<any> => {
  let assistant = await loadOpenAIAssistant(process.env.OPENAI_API_KEY || "", process.env.OPENAI_ASSISTANT_ID || "")
  const threadIds = (await prisma.threads.findMany()).map((value) => {
    return {
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
      threadId: value.threadId,
    }
  })
  res.send({
    assistantId: assistant.id,
    threadIds: threadIds,
  })
  // res.send("Chatbot OpenAI related Api v1");
})

export default router;