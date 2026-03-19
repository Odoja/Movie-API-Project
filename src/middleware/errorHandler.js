import http from 'node:http'

const errorStatusMap = {
  Unauthorized: 401,
  Forbidden: 403,
  'Movie not found': 404,
  'Movies not found': 404,
  'Genre not found': 404,
  'Genres not found': 404,
  'Language not found': 404,
  'Languages not found': 404,
  'Username already in use': 409,
  'Email already in use': 409
}

/**
 * Global error handler middleware.
 *
 * Handles all errors thrown in the application and formats them consistently.
 * Maps error messages to appropriate HTTP status codes.
 *
 * @param {Error} err - The error object.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} _next - Express next middleware function.
 * @returns {void} Sends a JSON response with error details and appropriate status code.
 */
export const errorHandler = (err, req, res, _next) => {
  console.error(err.message, { error: err })

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const errors = Object.keys(err.errors)
      .map(field => err.errors[field].message)
      .join(', ')

    return res.status(400).json({
      status: 400,
      message: errors
    })
  }

  // Handle Mongoose CastError
  if (err.name === 'CastError') {
    const field = err.path.split('.')[0]
    return res.status(400).json({
      status: 400,
      message: 'Invalid input',
      field
    })
  }

  // Map error message to status code
  const status = errorStatusMap[err.message] || err.status || 500

  if (process.env.NODE_ENV === 'production') {
    return res.status(status).json({
      status,
      message: err.message
    })
  }

  // In development, include error details.
  res.status(status).json({
    status,
    message: err.message
  })
}
