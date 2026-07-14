import { Router } from 'express';

import authRouter from './auth.js';
import userRouter from './user.js';
import linkRouter from './link.js';
import redirectRouter from './redirect.js';

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: API health check
 *     description: Returns a simple status payload indicating the API is live.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is live
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: API is live
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-07-14T09:00:00.000Z
 */
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
