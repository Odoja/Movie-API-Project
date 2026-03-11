import { JWT } from '../utils/JWT.js'

/**
 * Authenticates a request based on a JSON Web Token (JWT).
 *
 * This middleware checks the authorization header of the request, verifies the authentication scheme,
 * decodes the JWT using the provided secret key, and attaches the decoded user object to the `req.user` property.
 * If the authentication fails, an unauthorized response with a 401 Unauthorized status code is sent.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const authenticateJWT = async (req, res, next) => {
  try {
    const [authenticationScheme, token] = req.headers.authorization?.split(' ')

    if (authenticationScheme !== 'Bearer') {
      throw new Error('Invalid authentication scheme.')
    }

    if (!token) {
      throw new Error('Token missing.')
    }

    req.user = await JWT.decodeUser(token, process.env.JWT_SECRET)

    next()
  } catch (error) {
    next(new Error('Unauthorized'))
  }
}

/**
 * Checks if the user is the owner of the resource.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const checkOwnership = async (req, res, next) => {
  try {
    if (req.doc.owner.toString() !== req.user.id) {
      throw new Error('Forbidden')
    }

    next()
  } catch (error) {
    next(error)
  }
}

/**
 * Express middleware that validates the presence of a request body.
 *
 * Ensures that the incoming request contains a non-empty body object.
 * If the body is missing or empty, responds with a 400 Bad Request error.
 *
 * @param {object} req - Express request object.
 * @param {object} req.body - The request body to validate.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} Calls next() if validation passes, or sends 400 error response.
 */
export const requireBody = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      status_code: 400,
      message: 'Request body is required'
    })
  }
  next()
}
