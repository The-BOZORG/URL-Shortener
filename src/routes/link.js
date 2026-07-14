import { Router } from 'express';

import { createLink } from '../controllers/link/createLink.js';

import {
  authenticate,
  authorizePermissions,
} from '../middlewares/authenticate.js';
import { checkValidation } from '../middlewares/checkValidation.js';

import { global } from '../utils/rateLimiter.js';

const linkRouter = Router();

linkRouter.post(
  '/generate',
  global,
  authenticate,
  authorizePermissions('user', 'admin'),
  createLink,
);

export default linkRouter;
