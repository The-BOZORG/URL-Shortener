import { Router } from 'express';

import { getUser } from '../controllers/user/getUser.js';

import { authenticate } from '../middlewares/authenticate.js';

const userRouter = Router();

userRouter.get('/me', authenticate, getUser);

export default userRouter;
