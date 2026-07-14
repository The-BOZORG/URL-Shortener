import { Router } from 'express';

import { createLink } from '../controllers/link/createLink.js';
import { myLink } from '../controllers/link/myLink.js';

import {
  authenticate,
  authorizePermissions,
} from '../middlewares/authenticate.js';
import { checkValidation } from '../middlewares/checkValidation.js';

import { generateLinkValidator } from '../validators/link.js';

import { global } from '../utils/rateLimiter.js';

const linkRouter = Router();

linkRouter.get(
  '/my-link',
  global,
  authenticate,
  authorizePermissions('user', 'admin'),
  myLink,
);

linkRouter.post(
  '/generate',
  global,
  authenticate,
  authorizePermissions('user', 'admin'),
  generateLinkValidator,
  checkValidation,
  createLink,
);

export default linkRouter;
