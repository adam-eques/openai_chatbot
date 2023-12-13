import express, { NextFunction, Request, Response } from 'express';
import { loadOpenAI } from '../../../utils';

const router = express.Router();

router.route('/all').get(async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    const openai = loadOpenAI(process.env.OPENAI_API_KEY)
    const models = await (await openai.models.list({
    })).data.filter((value) => {
      return (value.owned_by === "openai" || value.owned_by === "system") && value.id.indexOf("tts") === -1 && value.id.indexOf("dall") === -1
    }).sort((a, b) => a.created - b.created)
    res.send({
      success: true,
      models: models,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send()
  }
  // res.send("Chatbot OpenAI related Api v1");
})

export default router;