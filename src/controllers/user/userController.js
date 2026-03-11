import { JWT } from '../../utils/JWT.js'
import { userModel } from '../../models/user/userModel.js'

const userM = new userModel()

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
      const user = await userM.authenticate(req.body.username, req.body.password)

      const accessToken = await JWT.encodeUser(user,
        process.env.JWT_SECRET,
        process.env.ACCESS_TOKEN_LIFE
      )
      res.json({ access_token: accessToken })
    } catch (error) {
      next(new Error('Unauthorized'))
    }
  }

  /**
   * Registers a new user account.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async register(req, res, next) {
    try {
      const user = await userM.register(req.body)

      res
        .status(201)
        .json({ id: user.id, username: user.username })
    } catch (error) {
      next(error)
    }
  }
}
