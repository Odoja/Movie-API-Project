import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { connectToDatabase } from './config/mongoose.js'
import { router } from './routes/router.js'

try {
  // Connect to MongoDB.
  await connectToDatabase(process.env.DB_CONNECTION_STRING)

  // Creates an Express application.
  const app = express()

  // Get the directory name of this module's path.
  const directoryFullName = dirname(fileURLToPath(import.meta.url))

  // Set the base URL to use for all relative URLs in a document.
  const baseURL = process.env.BASE_URL || '/'

  // View engine setup.
  app.set('view engine', 'ejs')
  app.set('views', join(directoryFullName, 'views'))
  app.set('layout', join(directoryFullName, 'views', 'layouts', 'default'))
  app.use(expressLayouts)

  // Middleware
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  app.use(express.static(join(directoryFullName, '..', 'public')))
  app.use((req, res, next) => {
    res.locals.baseURL = baseURL
    next()
  })

  // Register routes.
  app.use('/', router)

  app.use((err, req, res, _next) => {
    console.error(err.message, { error: err })

    if (err.status === 404) {
      return res.status(404).sendFile(join(directoryFullName, 'views', 'errors', '404.html'))
    }

    if (process.env.NODE_ENV === 'production') {
      return res.status(500).sendFile(join(directoryFullName, 'views', 'errors', '500.html'))
    }

    res.status(err.status || 500).render('errors/error', { error: err })
  })

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
