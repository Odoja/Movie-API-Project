import express from 'express'
import { router as homeRouter } from './homeRouter.js'
import { router as movieRouter } from './movieRouter.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/movies', movieRouter)
