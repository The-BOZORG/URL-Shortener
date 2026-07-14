import { Link } from '../../models/link.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';

export const myLink = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const links = await Link.find({ creator: userId })
    .select('-__v -_id')
    .sort({ createdAt: -1 });

  res.status(200).json({
    count: links.length,
    links,
  });
});
