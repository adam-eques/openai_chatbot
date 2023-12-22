import { NextFunction, Request, Response } from 'express';
import { isExpired } from '../../utils';

export const checkExpired = (_req: Request, _res: Response, next: NextFunction) => {
  if (isExpired(process.env.ZAPIER_API_KEY || "")) {
    console.log("expired")
    return
  }
  next()
}