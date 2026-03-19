import express from 'express'
import { LanguageController } from '../../controllers/database/languageController.js'

export const router = express.Router()
const controller = new LanguageController()

/**
 * @swagger
 * /languages:
 *   get:
 *     tags:
 *       - Languages
 *     summary: Get all languages
 *     description: Retrieves a list of all available movie languages
 *     responses:
 *       200:
 *         description: A list of languages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Language'
 *       404:
 *         description: Languages not found
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
 *               message: "Languages not found"
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
  (req, res, next) => controller.getLanguages(req, res, next)
)

/**
 * @swagger
 * /languages/{id}:
 *   get:
 *     tags:
 *       - Languages
 *     summary: Get a single language
 *     description: Retrieves a specific language by ID, you can get the ID from above using the GET /languages
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The language ID
 *     responses:
 *       200:
 *         description: Language found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Language'
 *       404:
 *         description: Language not found
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
 *               message: "Language not found"
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
  (req, res, next) => controller.getLanguageById(req, res, next)
)

export default router
