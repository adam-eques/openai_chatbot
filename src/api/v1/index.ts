import express, { NextFunction, Request, Response } from 'express';

import { checkExpired } from '../../middleware/checkParam/checkExpired';
import adminApi from './admin';
import chat from './chat';
import chatHistory from './chathistory';
import modelApi from './model';
import threads from './threads';

const router = express.Router();

router.use(checkExpired)

router.route('/').get((_req: Request, res: Response, _next: NextFunction): any => {
  res.send("Chatbot Api v1");
})

router.use('/admin', adminApi);
router.use('/chat', chat);
router.use('/chathistory', chatHistory);
router.use('/model', modelApi);
router.use('/threads', threads);

export default router;