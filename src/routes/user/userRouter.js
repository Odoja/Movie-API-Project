import express from 'express'
import { UserController } from '../../controllers/user/userController.js'

export const router = express.Router()
const controller = new UserController()

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with username and password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - username
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 example: "securepass123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input - validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *             examples:
 *               invalidEmail:
 *                 value:
 *                   status: 400
 *                   message: "Please provide a valid email address."
 *               shortPassword:
 *                 value:
 *                   status: 400
 *                   message: "The password must be of minimum length 10 characters."
 *               invalidUsername:
 *                 value:
 *                   status: 400
 *                   message: "Please provide a valid username."
 *       409:
 *         description: Conflict - Username or email already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *             examples:
 *               usernameInUse:
 *                 value:
 *                   status: 409
 *                   message: "Username already in use"
 *               emailInUse:
 *                 value:
 *                   status: 409
 *                   message: "Email already in use"
 */
router.post('/register', (req, res, next) => controller.register(req, res, next))

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Authenticate user
 *     description: Logs in a user and returns JWT access token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 example: "securepass123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   description: JWT token
 *       401:
 *         description: Unauthorized - Wrong username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *             example:
 *               status: 401
 *               message: "Unauthorized"
 */
router.post('/login', (req, res, next) => controller.login(req, res, next))
