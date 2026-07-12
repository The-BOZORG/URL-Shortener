import { Router } from 'express';

import { register } from '../controllers/auth/register.js';
import { verifyEmail } from '../controllers/auth/verifyEmail.js';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.get('/verify-email', verifyEmail);

export default authRouter;
