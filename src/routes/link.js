import { Router } from 'express';

import { createLink } from '../controllers/link/createLink.js';
import { myLink } from '../controllers/link/myLink.js';
import { deleteLink } from '../controllers/link/deleteLink.js';

import {
  authenticate,
  authorizePermissions,
} from '../middlewares/authenticate.js';
import { checkValidation } from '../middlewares/checkValidation.js';

import {
  deleteLinkValidator,
  generateLinkValidator,
} from '../validators/link.js';

import { global } from '../utils/rateLimiter.js';

const linkRouter = Router();

/* * @swagger
 * /link/my-link:
 *   get:
 *     summary: List the authenticated user's links
 *     description: >
 *       Returns all short links created by the authenticated user, ordered by
 *       most recent first. Requires a valid access token and `user` or
 *       `admin` role.
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of the user's links
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 links:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Link'
 *       401:
 *         description: Not authenticated */

linkRouter.get(
  '/my-link',
  global,
  authenticate,
  authorizePermissions('user', 'admin'),
  myLink,
);

/**
 *  @swagger
 * /link/generate:
 *   post:
 *     summary: Create a short link
 *     description: >
 *       Creates a new short link for the authenticated user. If `backHalf`
 *       is omitted, a random 6-character slug is generated. Requires a valid
 *       access token and `user` or `admin` role.
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - destination
 *             properties:
 *               title:
 *                 type: string
 *                 example: My Blog
 *               destination:
 *                 type: string
 *                 format: uri
 *                 example: https://blog.example.com/post-1
 *               backHalf:
 *                 type: string
 *                 description: Optional custom slug (must be unique)
 *                 example: myblog
 *     responses:
 *       201:
 *         description: Link created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 link:
 *                   $ref: '#/components/schemas/Link'
 *       400:
 *         description: Validation error or duplicate backHalf
 *       401:
 *         description: Not authenticated
 */

linkRouter.post(
  '/generate',
  global,
  authenticate,
  authorizePermissions('user', 'admin'),
  generateLinkValidator,
  checkValidation,
  createLink,
);

/**
 *  @swagger
 * /link/delete/{id}:
 *   delete:
 *     summary: Delete one of the user's links
 *     description: >
 *       Deletes the link with the given id if it belongs to the authenticated
 *       user. Requires a valid access token and `user` or `admin` role.
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the link
 *         example: 665f1c2e9d3c4a0012ab34ce
 *     responses:
 *       200:
 *         description: Link deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: link deleted successfully.
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Link not found or not owned by the user
 */

linkRouter.delete(
  '/delete/:id',
  global,
  authenticate,
  authorizePermissions('user', 'admin'),
  deleteLinkValidator,
  checkValidation,
  deleteLink,
);

export default linkRouter;
