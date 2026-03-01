import express from 'express'
import { router as homeRouter } from './homeRouter.js'
import { router as weatherRouter } from './weatherRouter.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/Weather', weatherRouter)
