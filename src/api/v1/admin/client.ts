import express, { NextFunction, Request, Response } from 'express';
import { prisma } from '../../../utils';

const router = express.Router();

router.route('/').get(async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
  const clientName = req.body.client

  try {
    const client = await prisma.client.findFirst({
      where: {
        name: clientName,
      }
    })

    res.send({
      success: true,
      client: client,
    })
  } catch (error) {
    console.error(error)
    res.status(404).send("Failed to find client");
  }
})

export default router;