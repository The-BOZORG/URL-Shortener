import { body, param, query } from 'express-validator';

export const getUserValidator = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('limit must be between 1 to 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('offset must positive int'),
];

export const updateValidator = [
  body('username')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('username must be less than 20 characters'),
  body('email').optional().trim().isEmail().withMessage('invalid email'),
  body('password')
    .optional()
    .notEmpty()
    .withMessage('password required')
    .isLength({ min: 6 })
    .withMessage('password must be more than 6 char'),
];

export const paramsValidator = [
  param('userId').notEmpty().isMongoId().withMessage('invalid user id'),
];
