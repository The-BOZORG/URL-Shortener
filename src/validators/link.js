import { body, param } from 'express-validator';
import { Link } from '../models/link.js';

export const generateLinkValidator = [
  body('destination')
    .notEmpty()
    .withMessage('destination is required')
    .isURL()
    .withMessage('invalid URL link'),
  body('backHalf')
    .optional()
    .trim()
    .custom(async (backHalf) => {
      const backHalfExist = await Link.exists({ backHalf }).exec();

      if (backHalfExist) throw new Error('this backHalf is already in user');
    }),
];

export const deleteLinkValidator = [
  param('id').isMongoId().withMessage('invalid link id'),
];
