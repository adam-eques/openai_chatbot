import express, { NextFunction, Request, Response } from 'express';
import { checkClientQuery } from '../../../middleware/checkParam';
import { prisma } from '../../../utils';

const router = express.Router();

router.route('/').get(checkClientQuery, async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
  const clientName = req.query.client as string

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