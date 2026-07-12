import { Router } from 'express';

import authRouter from './auth';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

router('/auth', authRouter);

export default router;
