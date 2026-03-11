import http from 'node:http'

const errorStatusMap = {
  'Unauthorized': 401,
  'Forbidden': 403,
  'Movie not found': 404,
  'Genre not found': 404,
  'Language not found': 404,
  'Username already in use': 409,
  'Email already in use': 409,
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
 */
export const errorHandler = (err, req, res, _next) => {
  console.error(err.message, { error: err })

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const errors = Object.keys(err.errors)
      .map(field => field.split('.')[0])
      .join(', ')

    return res.status(400).json({
      status: 400,
      message: 'Invalid input',
      field: errors
    })
  }

  // Handle Mongoose CastError
  if (err.name === 'CastError') {
    return res.status(404).json({
      status: 404,
      message: 'Resource not found'
    })
  }

  // Map error message to status code
  const status = errorStatusMap[err.message] || err.status || 500

  if (process.env.NODE_ENV === 'production') {
    return res.status(status).json({
      status: status,
      message: http.STATUS_CODES[status]
    })
  }

  // In development, include error details.
  res.status(status).json({
    status: status,
    message: err.message
  })
}
