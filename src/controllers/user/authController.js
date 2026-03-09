import http from 'node:http'
import { JWT } from '../../utils/JWT.js'
import { UserModel } from '../../models/user/userModel.js'

/**
 * Encapsulates the authentication controller.
 */
export class AuthController {
  /**
   * Authenticates a user and returns JWT access token.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login(req, res, next) {
    try {
      console.log('Authenticating user', { username: req.body.username })

      // Authenticate user
      const userDocument = await UserModel.authenticate(req.body.username, req.body.password)
      const user = userDocument.toObject()

      // Create the access token
      const accessToken = await JWT.encodeUser(user,
        process.env.JWT_SECRET,
        process.env.ACCESS_TOKEN_LIFE
      )
      res.status(200).json({ access_token: accessToken })
    } catch (error) {
      console.log('Authentication failed', { error: error.message, username: req.body?.username })

      // Authentication failed - 401 Unauthorized
      const httpStatusCode = 401
      const err = new Error(http.STATUS_CODES[httpStatusCode])
      err.status = httpStatusCode
      err.cause = error

      next(err)
    }
  }

  /**
   * Registers a new user account.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} A promise that resolves when the user is registered.
   */
  async register(req, res, next) {
    try {
      console.log('Creating new user account', { username: req.body.username })

      const { username, password, email, firstName, lastName } = req.body

      const [existingUsername, existingEmail] = await Promise.all([
        UserModel.findOne({ username }),
        UserModel.findOne({ email })
      ])

      if (existingUsername) {
        const err = new Error('Username already in use')
        err.status = 409
        return next(err)
      }

      if (existingEmail) {
        const err = new Error('Email already in use')
        err.status = 409
        return next(err)
      }

      const user = await UserModel.create({
        username,
        password,
        email,
        firstName,
        lastName
      })

      console.log('User account created successfully', { userId: user.id, username: user.username })

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/users/${user.id}`
      )

      res
        .location(location.href)
        .status(201)
        .json({ id: user.id, username: user.username })
    } catch (error) {
      console.log('User registration failed', { error: error.message, username: req.body?.username })

      const status = error.name === 'ValidationError' ? 400 : 500
      const err = new Error(http.STATUS_CODES[status])
      err.status = status
      err.cause = error

      next(err)
    }
  }
}
