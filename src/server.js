import http from 'node:http'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { connectToDatabase } from './config/mongoose.js'
import { router } from './routes/router.js'
import { errorHandler } from './middleware/errorHandler.js'

try {
  // Connect to MongoDB.
  await connectToDatabase(process.env.DB_CONNECTION_STRING)

  // Creates an Express application.
  const app = express()

  // Set various HTTP headers to make the application little more secure (https://www.npmjs.com/package/helmet).
  app.use(helmet())

  // Enable Cross Origin Resource Sharing (CORS) (https://www.npmjs.com/package/cors).
  app.use(cors())

  // Parse requests of the content type application/json.
  app.use(express.json({ limit: '500kb' }))

  // Register routes.
  app.use('/', router)

  // Error handler.
  app.use(errorHandler)

  // Starts the HTTP server listening for connections.
  const server = app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${server.address().port}`)
    console.log('Press Ctrl-C to terminate...')
  })

  // --------------------------------------------------------------------------
} catch (err) {
  console.error(err.message, { error: err })
  process.exitCode = 1
}
