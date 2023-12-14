import { NextFunction, Request, Response } from 'express';

export const checkClientQuery = (req: Request, res: Response, next: NextFunction) => {
  const client = req.query.client
  if (typeof client !== "string" || client === "") {
    return res.status(400).send({ error: "client field is wrong" })
  }
  next()
}

export const checkClientBody = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body)
  const client = req.body.client
  if (typeof client !== "string" || client === "") {
    return res.status(400).send({ error: "client field is wrong" })
  }
  next()
}