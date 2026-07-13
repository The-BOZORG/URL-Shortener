import { config } from '../../config/index.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { User } from '../../models/user.js';

export const getAllUser = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || config.defaultResLimit;
  const offset = parseInt(req.query.offset, 0) || config.defaultResOffset;
  const total = await User.countDocuments();

  const users = await User.find()
    .select('-__v')
    .limit(limit)
    .skip(offset)
    .lean()
    .exec();

  res.status(200).json({
    limit,
    offset,
    total,
    users,
  });
});
