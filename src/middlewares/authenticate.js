import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { User } from '../models/user.js';

import { UnAuthenticatedError } from '../errors/unAuthenticated.js';
import { ForbiddenError } from '../errors/forbidden.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    throw new UnAuthenticatedError('access denied,no token provided');

  const token = authHeader.split(' ')[1];

  try {
    const jwtPayload = verifyAccessToken(token);

    req.user = jwtPayload;

    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'access token expiry, request new one',
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'invalid access token',
      });
      return;
    }
    res.status(500).json({
      code: 'ServerError',
      message: 'internal server error',
      error: error,
    });
    logger.error({
      message: 'Error during authentication',
      error,
    });
  }
};

export const authorizePermissions = (...roles) => {
  return async (req, res, next) => {
    const { userId } = req.user;
    const user = await User.findById(userId).select('role').exec();

    if (!user) {
      throw new UnAuthenticatedError('user not found');
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenError('unauthorized to access this route');
    }

    next();
  };
};

export const checkPermissions = async (userId, resourceUserId) => {
  const user = await User.findById(userId).select('role').exec();

  if (!user) {
    throw new UnAuthenticatedError('user not found');
  }

  if (user.role === 'admin') {
    return;
  }

  if (user._id.toString() === resourceUserId.toString()) {
    return;
  }

  throw new ForbiddenError('Not authorized to access this route');
};
