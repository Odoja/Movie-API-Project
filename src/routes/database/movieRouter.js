import express from 'express'
import { movieController } from '../../controllers/database/movieController.js'
import { authenticateJWT, requireBody, checkOwnership } from '../../middleware/auth.js'

export const router = express.Router()
const controller = new movieController()

// Provide req.doc to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => controller.loadMovie(req, res, next, id))


// GET /movies - List all movies
router.get('/',
  (req, res, next) => controller.getMovies(req, res, next)
)

// GET /movies/:id - Get single movie
router.get('/:id',
  (req, res, next) => controller.getMovieById(req, res, next)
)

// POST /movies - Create movie
router.post('/',
  authenticateJWT,
  (req, res, next) => controller.createMovie(req, res, next)
)

// PUT /movies/:id - Edit movie
router.put('/:id',
  authenticateJWT,
  requireBody,
  checkOwnership,
  (req, res, next) => controller.updateMovie(req, res, next)
)

// DELETE /movies/:id - Delete movie
router.delete('/:id',
  authenticateJWT,
  checkOwnership,
  (req, res, next) => controller.deleteMovie(req, res, next)
)