import express, { NextFunction, Request, Response } from 'express';
import { loadOpenAIAssistant } from '../../../utils';

const router = express.Router();

router.route('/').get(async (_req: Request, res: Response, _next: NextFunction): Promise<any> => {
  let ass = await loadOpenAIAssistant(process.env.OPENAI_API_KEY || "", process.env.OPENAI_ASSISTANT_ID || "")
  console.log("ass", ass.id)
  res.send("Chatbot OpenAI related Api v1");
})

export default router;