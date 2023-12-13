import express, { NextFunction, Request, Response } from 'express';
import { prisma } from '../../../utils';

const router = express.Router();

router.route('/').get(async (req: Request, res: Response, _next: NextFunction) => {
  try {
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

    const threads = await prisma.client.findFirst({
      where: {
        name: clientName,
      }
    }).thread()

    const threadIds = threads.map(value => {
      return {
        createdAt: value.createdAt,
        threadId: value.threadId,
      }
    })
    res.send({
      assistantId: client.assistantId,
      name: client.name,
      threadIds: threadIds,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send()
  }
})

export default router;