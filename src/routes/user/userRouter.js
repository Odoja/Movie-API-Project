import express from 'express'
import { UserController } from '../../../controllers/api/userController.js'

export const router = express.Router()

const controller = new UserController()

// Provide req.user to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => controller.loadUserDocument(req, res, next, id))

router.get('/:id', (req, res, next) => controller.find(req, res, next))
