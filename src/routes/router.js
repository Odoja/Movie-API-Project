import express from 'express'
import { router as homeRouter } from './homeRouter.js'
import { router as movieRouter } from './movieRouter.js'
import { router as genreRouter } from './genreRouter.js'
import { router as languageRouter } from './languageRouter.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/movies', movieRouter)
router.use('/genres', genreRouter)
router.use('/languages', languageRouter)
