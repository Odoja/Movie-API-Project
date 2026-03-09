import express from 'express'
import { languageController } from '../controllers/languageController.js'

export const router = express.Router()
const controller = new languageController()

// GET /languages - List all languages (read-only)
router.get('/',
  (req, res, next) => controller.getLanguages(req, res, next)
)

// GET /languages/:id - Get single language (read-only)
router.get('/:id',
  (req, res, next) => controller.getLanguageById(req, res, next)
)

export default router
