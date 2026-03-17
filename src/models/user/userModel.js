import { User } from '../schemes/userSchema.js'

/**
 * Usermodel class.
 */
export class UserModel {
  /**
   * Authenticates a user with username and password.
   *
   * @param {string} username - The username.
   * @param {string} password - The password.
   * @returns {Promise<object>} - Authenticated user object.
   */
  async authenticate (username, password) {
    const user = await User.authenticate(username, password)
    return user.toObject()
  }

  /**
   * Registers a new user account.
   *
   * @param {object} data - User data.
   * @returns {Promise<object>} - Created user object.
   */
  async register (data) {
    const existingUsername = await User.findOne({ username: data.username })
    const existingEmail = await User.findOne({ email: data.email })

    if (existingUsername) {
      throw new Error('Username already in use')
    }

    if (existingEmail) {
      throw new Error('Email already in use')
    }

    const user = await User.create(data)

    return user.toObject()
  }
}
