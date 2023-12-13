import { NextFunction, Request, Response } from 'express';

export const checkInstructionQuery = (req: Request, res: Response, next: NextFunction) => {
  const insturction = req.query.insturction
  if (typeof insturction !== "string" || insturction === "") {
    return res.status(400).json("insturction field is wrong")
  }
  next()
}

export const checkInstructionBody = (req: Request, res: Response, next: NextFunction) => {
  const insturction = req.body.insturction
  if (typeof insturction !== "string" || insturction === "") {
    return res.status(400).json("insturction field is wrong")
  }
  next()
}