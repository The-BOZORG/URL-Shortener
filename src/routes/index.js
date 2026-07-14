import { Router } from 'express';

import authRouter from './auth.js';
import userRouter from './user.js';
import linkRouter from './link.js';
import redirectRouter from './redirect.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/link', linkRouter);
router.use('/redirect', redirectRouter);

export default router;
