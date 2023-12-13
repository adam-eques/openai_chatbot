import { NextFunction, Request, Response } from 'express';

export const checkUserIdQuery = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.query.userId
  if (typeof userId !== "string" || userId === "") {
    return res.status(400).json("userId field is wrong")
  }
  next()
}

export const checkUserIdBody = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.userId
  if (typeof userId !== "string" || userId === "") {
    return res.status(400).json("userId field is wrong")
  }
  next()
}