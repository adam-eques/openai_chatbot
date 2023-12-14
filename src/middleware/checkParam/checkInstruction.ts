import { NextFunction, Request, Response } from 'express';

export const checkInstructionQuery = (req: Request, res: Response, next: NextFunction) => {
  const instruction = req.query.instruction
  if (typeof instruction !== "string" || instruction === "") {
    return res.status(400).send({ error: "instruction field is wrong" })
  }
  next()
}

export const checkInstructionBody = (req: Request, res: Response, next: NextFunction) => {
  const instruction = req.body.instruction
  if (typeof instruction !== "string" || instruction === "") {
    return res.status(400).send({ error: "instruction field is wrong" })
  }
  next()
}