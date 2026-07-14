import crypto from 'crypto';

import { logger } from '../../utils/logger.js';
import { User } from '../../models/user.js';
import { config } from '../../config/index.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';

import { sendVerificationEmail } from '../../utils/sendVerificationEmail.js';

import { ForbiddenError } from '../../errors/forbidden.js';


export const register = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  if (role === 'admin' && !config.WHITELISTED_EMAIL.includes(email)) {
    logger.warn(
      `user with email ${email} tried to register as an admin but is not in whitelist`,
    );
    throw new ForbiddenError('you can not register as admin');
  }

  const verificationToken = crypto.randomBytes(40).toString('hex');

  const newUser = await User.create({
    username,
    email,
    password,
    role,
    verificationToken,
  });

  const origin = config.CLIENT_ORIGIN;

  await sendVerificationEmail({
    name: newUser.username,
    email: newUser.email,
    verificationToken: newUser.verificationToken,
    origin,
  });

  logger.info('verificationToken token sended successfully');

  res.status(201).json({
    msg: 'Registration successful. Please check your email to verify your account.',
  });
});
