import { logger } from '../../utils/logger.js';
import { User } from '../../models/user.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';

import { UnauthenticatedError } from '../../errors/unAuthenticated.js';

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, verificationToken } = req.body;

  const user = await User.findOne({ email }).exec();

  if (!user) {
    logger.warn(`user with this email: ${email} not found`);
    throw new UnauthenticatedError('verification failed');
  }

  if (user.verificationToken !== verificationToken)
    throw new UnauthenticatedError('Verification Failed');

  user.isVerified = true;
  user.verified = new Date();
  user.verificationToken = '';

  await user.save();

  logger.info(`email ${email} verified successfully`);

  res.status(200).json({ msg: 'email verified successfully' });
});
