import express from 'express'
import { languageController } from '../../controllers/database/languageController.js'

export const router = express.Router()
const controller = new languageController()

/**
 * @swagger
 * /languages:
 *   get:
 *     tags:
 *       - Languages
 *     summary: Get all languages
 *     description: Retrieve a list of all available languages in the system
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
 *       500:
 *         description: Server error
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
 *     description: Retrieve details of a specific language by its ID
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
 *       500:
 *         description: Server error
 */
router.get('/:id',
  (req, res, next) => controller.getLanguageById(req, res, next)
)

export default router
