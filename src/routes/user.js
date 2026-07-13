import { Router } from 'express';

import { getUser } from '../controllers/user/getUser.js';
import { getAllUser } from '../controllers/user/getAllUser.js';
import { getUserById } from '../controllers/user/getUserById.js';
import { updateUser } from '../controllers/user/updateUser.js';
import { deleteUser } from '../controllers/user/deleteUser.js';
import { getUserByEmail } from '../controllers/user/getUserByEmail.js';

import {
  authenticate,
  authorizePermissions,
} from '../middlewares/authenticate.js';

const userRouter = Router();

userRouter.get(
  '/me',
  authenticate,
  authorizePermissions('user', 'admin'),
  getUser,
);
userRouter.get(
  '/get-all',
  authenticate,
  authorizePermissions('admin'),
  getAllUser,
);

userRouter.patch(
  '/update',
  authenticate,
  authorizePermissions('user', 'admin'),
  updateUser,
);

userRouter.delete(
  '/delete/:id',
  authenticate,
  authorizePermissions('admin'),
  deleteUser,
);

userRouter.get(
  '/get-user/:id',
  authenticate,
  authorizePermissions('user', 'admin'),
  getUserById,
);

userRouter.get(
  '/get-email/:id',
  authenticate,
  authorizePermissions('admin'),
  getUserByEmail,
);

export default userRouter;
