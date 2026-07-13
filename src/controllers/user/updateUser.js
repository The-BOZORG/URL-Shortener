import { NotFoundError } from '../../errors/notFound.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { User } from '../../models/user.js';

export const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { username, email, password } = req.body;

  const user = await User.findById(userId).select('+password');

  if (!user) throw new NotFoundError('user not found');

  if (username) user.username = username;
  if (email) user.email = email;
  if (password) user.password = password;

  await user.save();

  return res.status(200).json({
    message: 'User updated successfully',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
});
