import express, { NextFunction, Request, Response } from 'express';
import { loadOpenAI } from '../../../utils';

const router = express.Router();

router.route('/:threadId/messages').get(async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const threadId = req.params.threadId
    console.log(threadId)
    const limit: number = Number(req.query.limit)
    const order: "asc" | "desc" = req.query.order as "asc" | "desc"
    const after: string = req.query.after as string
    const before: string = req.query.before as string

    const openai = loadOpenAI(process.env.OPENAI_API_KEY);
    const threadMessages = await openai.beta.threads.messages.list(threadId, {
      limit: limit,
      order: order,
      after: after,
      before: before,
    });

    res.send({
      messages: threadMessages.data
    })
  } catch (error) {
    console.error(error)
    res.status(404).send()
  }
})

export default router;