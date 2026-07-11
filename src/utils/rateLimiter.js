import { rateLimit } from 'express-rate-limit';

export const global = rateLimit({
  windowMs: 6 * 60 * 1000, // 6 minutes
  limit: 50,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'you have too many request in a time, pls try again later',
  },
});

export const auth = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'you have too many request in a time, pls try again later',
  },
});
