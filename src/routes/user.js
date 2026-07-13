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
import { checkValidation } from '../middlewares/checkValidation.js';

import {
  getUserValidator,
  updateValidator,
  paramsValidator,
} from '../validators/user.js';

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
  getUserValidator,
  checkValidation,
  authorizePermissions('admin'),
  getAllUser,
);

userRouter.patch(
  '/update',
  authenticate,
  updateValidator,
  checkValidation,
  authorizePermissions('user', 'admin'),
  updateUser,
);

userRouter.delete(
  '/delete/:id',
  authenticate,
  paramsValidator,
  checkValidation,
  authorizePermissions('admin'),
  deleteUser,
);

userRouter.get(
  '/get-user/:id',
  authenticate,
  paramsValidator,
  checkValidation,
  authorizePermissions('user', 'admin'),
  getUserById,
);

userRouter.get(
  '/get-email/:email',
  authenticate,
  authorizePermissions('admin'),
  getUserByEmail,
);

export default userRouter;
