import { Router } from 'express';

import { register } from '../controllers/auth/register.js';
import { verifyEmail } from '../controllers/auth/verifyEmail.js';
import { login } from '../controllers/auth/login.js';
import { logout } from '../controllers/auth/logout.js';
import { refresh } from '../controllers/auth/refreshToken.js';

import { checkValidation } from '../middlewares/checkValidation.js';
import { authenticate } from '../middlewares/authenticate.js';
import { loginValidator, registerValidator } from '../validators/auth.js';
import { global, auth } from '../utils/rateLimiter.js';

const authRouter = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: >
 *       Creates a new user account and sends a verification email.
 *       Registering with `role: admin` is only allowed for whitelisted emails.
 *       Rate limited (max 10 requests / 5 minutes).
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: secret123
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: user
 *     responses:
 *       201:
 *         description: Registration successful, verification email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Registration successful. Please check your email to verify your account.
 *       400:
 *         description: Validation error or email already in use
 *       403:
 *         description: Attempt to register as admin without whitelist permission
 *
 */
authRouter.post(
  '/register',
  auth,
  registerValidator,
  checkValidation,
  register,
);

/**
 *  @swagger
 * /auth/verify-email:
 *   get:
 *     summary: Verify a user's email address
 *     description: >
 *       Verifies the account using the `token` and `email` query parameters
 *       sent in the verification email. Rate limited (global limiter).
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token received by email
 *         example: a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         example: john@example.com
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: email verified successfully
 *       401:
 *         description: Invalid or missing token / email
 * */
authRouter.get('/verify-email', global, verifyEmail);

/**
 *  @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     description: >
 *       Authenticates a verified user. Returns a Bearer access token in the
 *       response body and sets an http-only refresh token cookie.
 *       Rate limited (max 10 requests / 5 minutes).
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: http-only refresh token cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokens'
 *       401:
 *         description: Invalid credentials, unverified email, or user not found
 * */
authRouter.post('/login', auth, loginValidator, checkValidation, login);

/**
 *  @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out the current user
 *     description: >
 *       Clears the stored refresh token for the user and removes the
 *       refresh token cookie. Requires a valid access token.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       401:
 *         description: Not authenticated
 * */
authRouter.post('/logout', global, authenticate, logout);

/**
 *  @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh the access token
 *     description: >
 *       Issues a new access token using the http-only refresh token cookie.
 *       The stored (hashed) refresh token must match. Requires a valid
 *       access token in the Authorization header.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access token refreshed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokens'
 *       400:
 *         description: Refresh token cookie not provided
 *       401:
 *         description: Invalid or mismatched refresh token
 */
authRouter.post('/refresh', global, authenticate, refresh);

export default authRouter;
