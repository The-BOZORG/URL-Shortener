import { Router } from 'express';

import { register } from '../controllers/auth/register.js';
import { verifyEmail } from '../controllers/auth/verifyEmail.js';
import { login } from '../controllers/auth/login.js';
import { logout } from '../controllers/auth/logout.js';
import { refresh } from '../controllers/auth/refreshToken.js';

import { checkValidation } from '../middlewares/checkValidation.js';
import { authenticate } from '../middlewares/authenticate.js';
import { loginValidator, registerValidator } from '../validators/auth.js';
import { global, auth } from '../utils/rateLimiter.js';

const authRouter = Router();

authRouter.post(
  '/register',
  auth,
  registerValidator,
  checkValidation,
  register,
);
authRouter.get('/verify-email', global, verifyEmail);
authRouter.post('/login', auth, loginValidator, checkValidation, login);
authRouter.post('/logout', global, authenticate, logout);
authRouter.post('/refresh', global, authenticate, refresh);

export default authRouter;
