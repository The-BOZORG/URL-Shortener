import { config } from '../../config/index.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { User } from '../../models/user.js';
import { logger } from '../../utils/logger.js';


export const logout = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const user = await User.findById(userId);

  if (user) {
    user.hashedRefreshToken = null;
    await user.save();

    logger.info(`user ${user.email} logged out successfully.`);
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});
