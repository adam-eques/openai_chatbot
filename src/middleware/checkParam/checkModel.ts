import { NextFunction, Request, Response } from 'express';
import config from '../../config';

export const checkModelQuery = (req: Request, res: Response, next: NextFunction) => {
  const model = req.query.model
  if (typeof model !== "string" || model === "" || config.models.indexOf(model) === -1) {
    return res.status(400).send({ error: "model field is wrong" })
  }
  next()
}

export const checkModelBody = (req: Request, res: Response, next: NextFunction) => {
  const model = req.body.model
  if (typeof model !== "string" || model === "" || config.models.indexOf(model) === -1) {
    return res.status(400).json({ error: "model field is wrong" })
  }
  next()
}