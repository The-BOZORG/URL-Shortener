import { NotFoundError } from '../../errors/notFound.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { User } from '../../models/user.js';

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select('-__v -isVerified').lean().exec();

  if (!user) throw new NotFoundError('user not found');

  res.status(200).json({ user });
});
