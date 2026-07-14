import crypto from 'crypto';

const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const generateBackHalf = () => {
  return Array.from(
    { length: 6 },
    () => chars[crypto.randomInt(chars.length)],
  ).join('');
};
