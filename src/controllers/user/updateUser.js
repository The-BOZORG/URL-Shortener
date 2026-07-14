import { BadRequestError } from '../../errors/badRequest.js';
import { NotFoundError } from '../../errors/notFound.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { User } from '../../models/user.js';


export const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { username, email, password } = req.body;

  const user = await User.findById(userId).select('+password');

  if (!user) throw new NotFoundError('User not found');

  if (username && username !== user.username) {
    const usernameExists = await User.exists({ username });

    if (usernameExists) {
      throw new BadRequestError('This username is already in use');
    }
    user.username = username;
  }

  if (email && email !== user.email) {
    const emailExists = await User.exists({ email });

    if (emailExists) {
      throw new BadRequestError('This email is already in use');
    }

    user.email = email;
  }

  if (password) {
    user.password = password;
  }

  await user.save();

  res.status(200).json({
    message: 'User updated successfully',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});
