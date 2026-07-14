import { Router } from 'express';

import { getUser } from '../controllers/user/getUser.js';
import { getAllUser } from '../controllers/user/getAllUser.js';
import { getUserById } from '../controllers/user/getUserById.js';
import { updateUser } from '../controllers/user/updateUser.js';
import { deleteUser } from '../controllers/user/deleteUser.js';
import { getUserByEmail } from '../controllers/user/getUserByEmail.js';

import {
  authenticate,
  authorizePermissions,
} from '../middlewares/authenticate.js';
import { checkValidation } from '../middlewares/checkValidation.js';

import {
  getUserValidator,
  updateValidator,
  paramsValidator,
} from '../validators/user.js';

import { global } from '../utils/rateLimiter.js';

const userRouter = Router();

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Get the current user's profile
 *     description: Returns the profile of the authenticated user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User not found
 * */
userRouter.get(
  '/me',
  global,
  authenticate,
  authorizePermissions('user', 'admin'),
  getUser,
);

/**
 * @swagger
 * /user/get-all:
 *   get:
 *     summary: List all users (admin only)
 *     description: Returns a paginated list of users. Admin role required.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of users to return
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of users to skip
 *     responses:
 *       200:
 *         description: Paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 offset:
 *                   type: integer
 *                   example: 0
 *                 total:
 *                   type: integer
 *                   example: 42
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 *  */
userRouter.get(
  '/get-all',
  global,
  authenticate,
  getUserValidator,
  checkValidation,
  authorizePermissions('admin'),
  getAllUser,
);
/**
 * @swagger
 * /user/update:
 *   patch:
 *     summary: Update the current user's profile
 *     description: >
 *       Updates the authenticated user's username, email, or password.
 *       Uniqueness of username/email is enforced. Requires a valid access
 *       token and `user` or `admin` role.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 maxLength: 20
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: newsecret123
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 665f1c2e9d3c4a0012ab34cd
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *       400:
 *         description: Validation error, email/username already in use
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User not found */

userRouter.patch(
  '/update',
  global,
  authenticate,
  updateValidator,
  checkValidation,
  authorizePermissions('user', 'admin'),
  updateUser,
);

/**
 *  @swagger
 * /user/delete/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     description: Deletes the user with the given id. Admin role required.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the user
 *         example: 665f1c2e9d3c4a0012ab34cd
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 *       404:
 *         description: User not found */

userRouter.delete(
  '/delete/:id',
  global,
  authenticate,
  paramsValidator,
  checkValidation,
  authorizePermissions('admin'),
  deleteUser,
);

/**
 *  @swagger
 * /user/get-user/{id}:
 *   get:
 *     summary: Get a user by id
 *     description: Returns a user profile by its id. Requires a valid access
 *       token and `user` or `admin` role.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the user
 *         example: 665f1c2e9d3c4a0012ab34cd
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User not found
 * */

userRouter.get(
  '/get-user/:id',
  global,
  authenticate,
  paramsValidator,
  checkValidation,
  authorizePermissions('user', 'admin'),
  getUserById,
);

/**
 *  @swagger
 * /user/get-email/{email}:
 *   get:
 *     summary: Get a user by email (admin only)
 *     description: Returns a user profile by email address. Admin role required.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email address of the user
 *         example: john@example.com
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 *       404:
 *         description: User not found
 */
userRouter.get(
  '/get-email/:email',
  global,
  authenticate,
  authorizePermissions('admin'),
  getUserByEmail,
);

export default userRouter;
