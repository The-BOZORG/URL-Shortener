import { Router } from 'express';

import { redirect } from '../controllers/redirect/redirect.js';

import {
  authenticate,
  authorizePermissions,
} from '../middlewares/authenticate.js';

import { global } from '../utils/rateLimiter.js';

const redirectRouter = Router();

/**
 * @swagger
 * /redirect/{backHalf}:
 *   get:
 *     summary: Redirect to the destination URL
 *     description: >
 *       Resolves the short link slug and redirects the browser to the
 *       destination URL, incrementing visit counters on the link and its
 *       creator. Requires a valid access token and `user` or `admin` role.
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: backHalf
 *         required: true
 *         schema:
 *           type: string
 *         description: Short link slug
 *         example: aB3xZ9
 *     responses:
 *       302:
 *         description: Temporary redirect to the destination URL
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Link not found
 */

redirectRouter.get(
  '/:backHalf',
  global,
  authenticate,
  authorizePermissions('user', 'admin'),
  redirect,
);

export default redirectRouter;
