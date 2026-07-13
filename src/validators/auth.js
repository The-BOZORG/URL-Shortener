import { body } from 'express-validator';
import { User } from '../models/user.js';
import { logger } from '../utils/logger.js';

export const registerValidator = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('username is required')
    .bail()
    .isLength({ min: 3 })
    .withMessage('username must be at least 3 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .bail()
    .isEmail()
    .withMessage('invalid email')
    .custom(async (value) => {
      const userExist = await User.exists({ email: value }).exec();

      if (userExist) {
        logger.error(`this email: ${value} already used`);
        throw new Error('this email already in use');
      }
      return true;
    }),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),
  body('role')
    .notEmpty()
    .withMessage('role is required')
    .bail()
    .isIn(['user', 'admin'])
    .withMessage('role is not support'),
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .bail()
    .isEmail()
    .withMessage('invalid email'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),
];
