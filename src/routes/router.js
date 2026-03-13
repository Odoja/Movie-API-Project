import express from 'express'
import { router as userRouter } from './user/userRouter.js'
import { router as movieRouter } from './database/movieRouter.js'
import { router as genreRouter } from './database/genreRouter.js'
import { router as languageRouter } from './database/languageRouter.js'

export const router = express.Router()

router.use('/user', userRouter)
router.use('/movies', movieRouter)
router.use('/genres', genreRouter)
router.use('/languages', languageRouter)
