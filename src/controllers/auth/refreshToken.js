import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { User } from '../../models/user.js';

import {
  verifyRefreshToken,
  generateAccessToken,
  createPayload,
  hashString,
} from '../../utils/jwt.js';

import { logger } from '../../utils/logger.js';

import { BadRequestError } from '../../errors/badRequest.js';
import { UnAuthenticatedError } from '../../errors/unAuthenticated.js';

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    logger.warn('Refresh token not provided');
    throw new BadRequestError('Refresh token not provided');
  }

  const payload = verifyRefreshToken(refreshToken);

  const user = await User.findById(payload.userId).select(
    '+hashedRefreshToken',
  );

  if (!user) {
    logger.warn('user not found');
    throw new UnAuthenticatedError('authentication invalid');
  }

  if (!user.hashedRefreshToken) {
    logger.warn(`user ${user.email} has no refresh token`);
    throw new UnAuthenticatedError('authentication invalid');
  }

  const matchHashedToken = hashString(refreshToken);

  if (matchHashedToken !== user.hashedRefreshToken) {
    logger.warn(`refresh token not match for ${user.email}`);
    throw new UnAuthenticatedError('Authentication invalid');
  }

  const accessToken = generateAccessToken({
    payload: createPayload(user),
  });

  logger.info(`access token refreshed for ${user.email}`);

  res.status(200).json({
    success: true,
    accessToken,
  });
});
