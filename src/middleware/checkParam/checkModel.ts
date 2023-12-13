import { NextFunction, Request, Response } from 'express';

export const checkModelQuery = (req: Request, res: Response, next: NextFunction) => {
  const model = req.query.model
  if (typeof model !== "string" || model === "") {
    return res.status(400).json("model field is wrong")
  }
  next()
}

export const checkModelBody = (req: Request, res: Response, next: NextFunction) => {
  const model = req.body.model
  if (typeof model !== "string" || model === "") {
    return res.status(400).json("model field is wrong")
  }
  next()
}