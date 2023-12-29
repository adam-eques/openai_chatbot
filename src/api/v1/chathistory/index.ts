import express, { NextFunction, Request, Response } from 'express';

const router = express.Router();

router.route('/').get(async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
  const threadId = req.query.threadId as string
  res.redirect(`${process.env.CHAT_HISTORY_URL}?threadId=${threadId}`)
})

export default router;