import express from 'express'
import { movieController } from '../controllers/movieController.js'

export const router = express.Router()
const controller = new movieController()


// GET /movies - List all movies
router.get('/',
  (req, res, next) => controller.getMovies(req, res, next)
)

// POST /movies - Create movie
router.post('/',
  (req, res, next) => controller.createMovie(req, res, next)
)

// GET /movies/:id - Get single movie
router.get('/:id',
  (req, res, next) => controller.getMovieById(req, res, next)
)

// PUT /movies/:id - Edit movie
router.put('/:id',
  (req, res, next) => controller.updateMovie(req, res, next)
)

// DELETE /movies/:id - Delete movie
router.delete('/:id',
  (req, res, next) => controller.deleteMovie(req, res, next)
)