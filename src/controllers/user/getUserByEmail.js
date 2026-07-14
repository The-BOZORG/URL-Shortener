import { NotFoundError } from '../../errors/notFound.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { User } from '../../models/user.js';


export const getUserByEmail = asyncHandler(async (req, res) => {
  const { email } = req.query;

  const user = await User.findOne(email).select('-__v').lean().exec();

  if (!user) throw new NotFoundError('user not found');

  res.status(200).json({ user });
});
