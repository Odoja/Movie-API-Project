import express from 'express'
import { movieController } from '../controllers/movieController.js'

export const router = express.Router()
const controller = new movieController()


// GET /images - List all images
router.get('/',
  (req, res, next) => controller.getMovies(req, res, next)
)

// POST /images - Create image
router.post('/',
  (req, res, next) => controller.createMovie(req, res, next)
)

// GET /images/:id - Get single image
router.get('/:id',
  (req, res, next) => controller.getMovieById(req, res, next)
)

// PUT /images/:id - Edit image
router.put('/:id',
  (req, res, next) => controller.updateMovie(req, res, next)
)

// PATCH /images/:id - Partially edit image
router.patch('/:id',
  (req, res, next) => controller.updateMovie(req, res, next)
)

// DELETE /images/:id - Delete image
router.delete('/:id',
  (req, res, next) => controller.deleteMovie(req, res, next)
)