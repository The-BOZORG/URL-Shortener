import { Link } from '../../models/link.js';
import { User } from '../../models/user.js';

import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { NotFoundError } from '../../errors/notFound.js';


export const redirect = asyncHandler(async (req, res) => {
  const { backHalf } = req.params;

  const link = await Link.findOne({ backHalf })
    .select('destination creator totalVisitCount')
    .exec();

  if (!link) throw new NotFoundError('link not found');

  link.totalVisitCount++;
  await link.save();

  const user = await User.findById(link.creator)
    .select('totalVisitCount')
    .exec();

  if (!user) throw new NotFoundError('user not found');

  user.totalVisitCount++;
  await user.save();

  const destination = link.destination.startsWith('https://')
    ? link.destination
    : `https://${link.destination}`;

  res.redirect(destination);
});
