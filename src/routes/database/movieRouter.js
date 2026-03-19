import express from 'express'
import { MovieController } from '../../controllers/database/movieController.js'
import { authenticateJWT, requireBody, checkOwnership } from '../../middleware/auth.js'

export const router = express.Router()
const controller = new MovieController()

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies
 *     description: Retrieves a paginated and filtered list of all movies in the database. Uses page-based pagination (1-indexed).
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (1-indexed). Default is 1.
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by movie title (case-insensitive partial match)
 *     responses:
 *       200:
 *         description: List of movies with metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *                 metaData:
 *                   type: object
 *                   properties:
 *                     totalMovies:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     next_url:
 *                       type: string
 *                       nullable: true
 *                     prev_url:
 *                       type: string
 *                       nullable: true
 *       404:
 *         description: Movies not found
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
 *               status: 404
 *               message: "Movies not found"
 *       500:
 *         description: Internal Server Error
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
 *               status: 500
 *               message: "Internal Server Error"
 */
router.get('/',
  (req, res, next) => controller.getMovies(req, res, next)
)

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get a single movie
 *     description: Retrieves a specific movie by ID with genres and language information. You can get the ID required above from GET /movies.
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
 *               status: 404
 *               message: "Movie not found"
 *       500:
 *         description: Internal Server Error
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
 *               status: 500
 *               message: "Internal Server Error"
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
 *     description: Creates a new movie (requires authentication). Popularity, vote count, and vote average are automatically set to 0. You can get the ID required to set the Genres and Language using the GET /genres and GET /languages that's below.
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
 *               status: 400
 *               message: "Invalid input"
 *               field: "Title, releaseDate, overview, genres, language"
 *       401:
 *         description: Unauthorized - missing or invalid JWT token
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
 *       500:
 *         description: Internal Server Error
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
 *               status: 500
 *               message: "Internal Server Error"
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
 *     description: Updates an existing movie (requires authentication and ownership). Only the movie creator can update their movie. All fields are optional - only provide the fields you want to update. You can get the IDs required to set the Genres and Language using the GET /genres and GET /languages endpoints below.
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
 *               status: 400
 *               message: "Invalid input"
 *               field: "Title, releaseDate, overview, genres, language"
 *       401:
 *         description: Unauthorized - missing or invalid JWT token
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
 *       403:
 *         description: Forbidden - The logged-in user does not have the necessary rights to delete this movie.
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
 *               message: "Forbidden"
 *       404:
 *         description: Movie not found
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
 *               status: 404
 *               message: "Movie not found"
 *       500:
 *         description: Internal Server Error
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
 *               status: 500
 *               message: "Internal Server Error"
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
 *    delete:
 *     summary: Delete a movie
 *     description: Deletes a movie (requires authentication and ownership). Only the movie creator can delete their movie. This action is permanent and cannot be undone. You can get the ID required above from GET /movies.
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
 *         description: Unauthorized - missing or invalid JWT token
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
 *       403:
 *         description: Forbidden - The logged-in user does not have the necessary rights to delete this movie.
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
 *               message: "Forbidden"
 *       404:
 *         description: Movie not found
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
 *               status: 404
 *               message: "Movie not found"
 *       500:
 *         description: Internal Server Error
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
 *               status: 500
 *               message: "Internal Server Error"
 */
router.delete('/:id',
  authenticateJWT,
  (req, res, next) => controller.loadMovie(req, res, next, req.params.id),
  checkOwnership,
  (req, res, next) => controller.deleteMovie(req, res, next)
)
