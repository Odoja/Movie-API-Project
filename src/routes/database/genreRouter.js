import express from 'express'
import { genreController } from '../../controllers/database/genreController.js'

export const router = express.Router()
const controller = new genreController()

// GET /genres - List all genres (read-only)
router.get('/',
  (req, res, next) => controller.getGenres(req, res, next)
)

// GET /genres/:id - Get single genre (read-only)
router.get('/:id',
  (req, res, next) => controller.getGenreById(req, res, next)
)

export default router
