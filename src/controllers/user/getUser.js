import { NotFoundError } from '../../errors/notFound.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { User } from '../../models/user.js';


export const getUser = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const user = await User.findById(userId)
    .select('-__v -isVerified')
    .lean()
    .exec();

  if (!user) throw new NotFoundError('user not found');

  res.status(200).json({ user });
});
