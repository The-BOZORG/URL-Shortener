import { Router } from 'express';

import { redirect } from '../controllers/redirect/redirect.js';

import {
  authenticate,
  authorizePermissions,
} from '../middlewares/authenticate.js';

import { global } from '../utils/rateLimiter.js';

const redirectRouter = Router();

redirectRouter.post(
  '/:backHalf',
  global,
  authenticate,
  authorizePermissions('user', 'admin'),
  redirect,
);

export default redirectRouter;
