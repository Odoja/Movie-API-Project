import express from 'express'
import { router as authRouter } from './user/authRouter.js'
import { router as movieRouter } from './database/movieRouter.js'
import { router as genreRouter } from './database/genreRouter.js'
import { router as languageRouter } from './database/languageRouter.js'

export const router = express.Router()

router.use('/auth', authRouter)
router.use('/movies', movieRouter)
router.use('/genres', genreRouter)
router.use('/languages', languageRouter)
