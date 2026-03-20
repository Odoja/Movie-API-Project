import express from 'express'
import { GenreController } from '../../controllers/database/genreController.js'

export const router = express.Router()
const controller = new GenreController()

/**
 * @swagger
 * /genres:
 *   get:
 *     summary: Get all genres
 *     description: Retrieves a list of all available movie genres
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: List of genres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 *       404:
 *         description: Genres not found
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
 *               message: "Genres not found"
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
  (req, res, next) => controller.getGenres(req, res, next)
)

/**
 * @swagger
 * /genres/{id}:
 *   get:
 *     summary: Get a single genre
 *     description: Retrieves a specific genre by ID, you can get the ID from above using the GET /genres endpoint
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Genre ID
 *     responses:
 *       200:
 *         description: Genre details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       404:
 *         description: Genre not found
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
 *               message: "Genre not found"
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
  (req, res, next) => controller.getGenreById(req, res, next)
)

export default router
