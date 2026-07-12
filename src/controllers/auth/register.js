import { logger } from '../../utils/logger.js';
import User from '../../models/user.js';
import { config } from '../../config/index.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';

import {
  generateAccessToken,
  createTokenCookie,
  createPayload,
} from '../../utils/jwt.js';

import { ForbiddenError } from '../../errors/forbidden.js';
import { BadRequestError } from '../../errors/badRequest.js';

export const register = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  const emailAlreadyExist = await User.findOne({ email }).lean().exec();

  if (emailAlreadyExist) {
    throw new BadRequestError('email already exist');
  }

  if (role === 'admin' && !config.WHITELISTED_EMAIL.includes(email)) {
    logger.warn(
      `user with email ${email} tried to register as an admin but is not in whitelist`,
    );
    throw new ForbiddenError('you can not register as admin');
  }
  const newUser = await User.create({
    username,
    email,
    password,
    role,
  });

  const payload = createPayload(newUser);
  const accessToken = generateAccessToken({ payload });
  const refreshToken = createTokenCookie({
    res,
    payload,
  });

  newUser.refreshToken = refreshToken;
  await newUser.save();

  res.status(201).json({
    user: {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    },
    accessToken,
  });
  logger.info('user register success!');
});
