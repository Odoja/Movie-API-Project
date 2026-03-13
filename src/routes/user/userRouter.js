import express from 'express'
import { UserController } from '../../controllers/user/userController.js'

export const router = express.Router()
const controller = new UserController()

// Register
router.post('/register', (req, res, next) => controller.register(req, res, next))

// Log in
router.post('/login', (req, res, next) => controller.login(req, res, next))
