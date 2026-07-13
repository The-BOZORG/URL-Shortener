import { logger } from '../../utils/logger.js';
import { User } from '../../models/user.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';

import { UnAuthenticatedError } from '../../errors/unAuthenticated.js';

import {
  createPayload,
  generateAccessToken,
  createTokenCookie,
  hashString,
} from '../../utils/jwt.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    logger.warn(`User not found: ${email}`);
    throw new UnAuthenticatedError('invalid credentials');
  }

  const correctPassword = await user.comparePassword(password);

  if (!correctPassword) {
    logger.error(`wrong password: ${email}`);
    throw new UnAuthenticatedError('invalid credentials');
  }

  if (!user.isVerified) {
    logger.warn(`email not verified: ${email}`);
    throw new UnAuthenticatedError('Please verify your email');
  }

  const payload = createPayload(user);

  const accessToken = generateAccessToken({ payload });
  const refreshToken = createTokenCookie({ res, payload });
  const hashedRefreshToken = hashString(refreshToken);

  user.hashedRefreshToken = hashedRefreshToken;
  await user.save();

  logger.info(`user ${user.email} logged in successfully.`);

  res.status(200).json({
    success: true,
    accessToken,
  });
});
