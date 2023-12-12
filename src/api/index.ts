import express from 'express';
import apiv1 from './v1';

const router = express.Router();

router.use('/v1', apiv1);

export default router;