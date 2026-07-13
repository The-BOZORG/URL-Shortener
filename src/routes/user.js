import { Router } from 'express';

import { getUser } from '../controllers/user/getUser.js';
import { getAllUser } from '../controllers/user/getAllUser.js';

import {
  authenticate,
  authorizePermissions,
} from '../middlewares/authenticate.js';

const userRouter = Router();

userRouter.get(
  '/me',
  authenticate,
  authorizePermissions(['user', 'admin']),
  getUser,
);
userRouter.get(
  '/get-all',
  authenticate,
  authorizePermissions(['admin']),
  getAllUser,
);

export default userRouter;
