import express from 'express'
import { movieController } from '../../controllers/database/movieController.js'
import { authenticateJWT, requireBody, checkOwnership } from '../../middleware/auth.js'

export const router = express.Router()
const controller = new movieController()

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies
 *     description: Retrieves a paginated list of all movies in the database
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of documents to skip
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of movies to return
 *     responses:
 *       200:
 *         description: List of movies with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     skip:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     count:
 *                       type: integer
 *       500:
 *         description: Server error
 */
router.get('/',
  (req, res, next) => controller.getMovies(req, res, next)
)

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get a single movie
 *     description: Retrieves a specific movie by ID with genres and language information
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.get('/:id',
  (req, res, next) => controller.loadMovie(req, res, next, req.params.id),
  (req, res, next) => controller.getMovieById(req, res, next)
)

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create a new movie
 *     description: Creates a new movie (requires authentication). Popularity, vote count, and vote average are automatically set to 0.
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - releaseDate
 *               - overview
 *               - genres
 *               - language
 *             properties:
 *               title:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *                 format: date
 *               overview:
 *                 type: string
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *               language:
 *                 type: string
 *               posterUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/',
  authenticateJWT,
  (req, res, next) => controller.createMovie(req, res, next)
)

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update a movie
 *     description: Updates an existing movie (requires authentication and ownership)
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *               overview:
 *                 type: string
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *               language:
 *                 type: string
 *               posterUrl:
 *                 type: string
 *     responses:
 *       204:
 *         description: Movie updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Movie not found
 */
router.put('/:id',
  authenticateJWT,
  (req, res, next) => controller.loadMovie(req, res, next, req.params.id),
  requireBody,
  checkOwnership,
  (req, res, next) => controller.updateMovie(req, res, next)
)

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete a movie
 *     description: Deletes a movie (requires authentication and ownership)
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       204:
 *         description: Movie deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Movie not found
 */
router.delete('/:id',
  authenticateJWT,
  (req, res, next) => controller.loadMovie(req, res, next, req.params.id),
  checkOwnership,
  (req, res, next) => controller.deleteMovie(req, res, next)
)