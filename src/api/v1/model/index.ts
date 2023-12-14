import express, { NextFunction, Request, Response } from 'express';
import config from '../../../config';

const router = express.Router();

router.route('/all').get(async (_req: Request, res: Response, _next: NextFunction) => {
  res.send({
    success: true,
    models: config.models,
  })
})

export default router;