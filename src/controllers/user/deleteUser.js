import { NotFoundError } from '../../errors/notFound.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { User } from '../../models/user.js';


export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (!user) throw new NotFoundError('user not found');

  return res.status(200).json({
    message: 'User deleted successfully',
  });
});
