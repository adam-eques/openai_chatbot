import express, { NextFunction, Request, Response } from 'express';

import adminApi from './admin';
import chat from './chat';
import openaiApi from './openaiapi';
import threads from './threads';

const router = express.Router();

router.route('/').get((_req: Request, res: Response, _next: NextFunction): any => {
  res.send("Chatbot Api v1");
})

router.use('/admin', adminApi);
router.use('/openai', openaiApi);
router.use('/chat', chat);
router.use('/threads', threads);

export default router;