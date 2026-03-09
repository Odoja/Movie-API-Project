import express from 'express'
import { AuthController } from '../../controllers/user/authController.js'

export const router = express.Router()
const controller = new AuthController()

// Register
router.post('/register', (req, res, next) => controller.register(req, res, next))

// Log in
router.post('/login', (req, res, next) => controller.login(req, res, next))
