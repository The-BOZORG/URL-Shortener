import { Router } from 'express';

import { createLink } from '../controllers/link/createLink.js';
import { myLink } from '../controllers/link/myLink.js';
import { deleteLink } from '../controllers/link/deleteLink.js';

import {
  authenticate,
  authorizePermissions,
} from '../middlewares/authenticate.js';
import { checkValidation } from '../middlewares/checkValidation.js';

import {
  deleteLinkValidator,
  generateLinkValidator,
} from '../validators/link.js';

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

linkRouter.delete(
  '/delete/:id',
  global,
  authenticate,
  authorizePermissions('user', 'admin'),
  deleteLinkValidator,
  checkValidation,
  deleteLink,
);

export default linkRouter;
