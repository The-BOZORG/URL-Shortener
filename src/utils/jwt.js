import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/index.js';

export const createPayload = (user) => {
  return { userId: user._id };
};

export const hashString = (string) =>
  crypto.createHash('md5').update(string).digest('hex');

export const generateAccessToken = ({ payload }) => {
  return jwt.sign(payload, config.JWT_ACCESS_TOKEN, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY,
    subject: 'accessToken',
  });
};

export const generateRefreshToken = ({ payload }) => {
  return jwt.sign(payload, config.JWT_REFRESH_TOKEN, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY,
    subject: 'refreshToken',
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.JWT_ACCESS_TOKEN);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.JWT_REFRESH_TOKEN);
};

export const createTokenCookie = ({ res, payload }) => {
  const refreshToken = generateRefreshToken({ payload });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: config.COOKIE_MAX_AGE,
  });

  return refreshToken;
};
