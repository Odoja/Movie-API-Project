import http from 'node:http'

/**
 * Global error handler middleware.
 *
 * Handles all errors thrown in the application and formats them consistently.
 * Handles Mongoose ValidationError specifically to return 400 with validation message.
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
    const firstError = Object.values(err.errors)[0]
    return res.status(400).json({
      status: 400,
      message: firstError.message
    })
  }

  if (!err.status) {
    err.status = 500
  }

  if (process.env.NODE_ENV === 'production') {
    return res.status(err.status).json({
      status: err.status,
      message: http.STATUS_CODES[err.status]
    })
  }

  // In development, include full error details.
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message,
    error: err
  })
}
