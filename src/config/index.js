const CORS_WHITELIST = ['https://URL-Shorter.project.com'];
const _1H = 1000 * 60 * 60;
const _7DAYS = 1000 * 60 * 60 * 24 * 7;

export const config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,
  CORS_WHITELIST,
  WINDOW_MS: _1H,
  MONGO_URI: process.env.MONGO_URI,
  WHITELISTED_EMAIL: process.env.WHITELISTED_EMAIL?.split(','),
  JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  COOKIE_MAX_AGE: _7DAYS,
  JWT_PASSWORD_RESET_TOKEN: process.env.JWT_PASSWORD_RESET_TOKEN,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  SMPT_AUTH_USERNAME: process.env.SMPT_AUTH_USERNAME,
  SMPT_AUTH_PASS: process.env.SMPT_AUTH_PASS,
  defaultResLimit: 10,
  defaultResOffset: 0,
};
