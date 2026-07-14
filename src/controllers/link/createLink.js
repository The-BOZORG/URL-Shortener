import { Link } from '../../models/link.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { generateBackHalf } from '../../utils/generateBackHalf.js';

import { config } from '../../config/index.js';

export const createLink = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const { title, destination, backHalf = generateBackHalf() } = req.body;

  const link = await Link.create({
    title,
    destination,
    backHalf,
    shortLink: `${config.CLIENT_ORIGIN}/${backHalf}`,
    creator: userId,
  });

  res.status(201).json({ link });
});
