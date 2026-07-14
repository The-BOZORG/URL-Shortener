import { Link } from '../../models/link.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';

import { NotFoundError } from '../../errors/notFound.js';

export const deleteLink = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const link = await Link.findOneAndDelete({
    _id: id,
    creator: userId,
  });

  if (!link) throw new NotFoundError('link not found');

  res.status(200).json({
    message: 'link deleted successfully.',
  });
});
