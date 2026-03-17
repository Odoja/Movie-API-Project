import jwt from 'jsonwebtoken'

/**
 * Exposes methods for working with JSON Web Tokens (JWTs).
 */
export class JWT {
  /**
   * Decodes a JWT and returns the user object extracted from the payload.
   *
   * @param {string} token - The JWT to decode.
   * @param {string} secret - The secret key used for verifying the JWT.
   * @returns {Promise<object>} A Promise that resolves to the user object extracted from the JWT payload.
   */
  static async decodeUser (token, secret) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, { algorithm: 'HS256' }, (error, decoded) => {
        if (error) {
          reject(error)
          return
        }

        const user = {
          id: decoded.sub,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          username: decoded.username
        }

        resolve(user)
      })
    })
  }

  /**
   * Encodes user information into a JSON Web Token (JWT) payload.
   *
   * @param {object} user - The user object containing user information to encode.
   * @param {string} secret - The secret key used for signing the JWT.
   * @param {string|number} expiresIn - The expiration time for the JWT (e.g., '1h', '7d').
   * @returns {Promise<string>} A Promise that resolves to the generated JWT.
   */
  static async encodeUser (user, secret, expiresIn) {
    const payload = {
      sub: user._id || user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username
    }

    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        secret,
        {
          algorithm: 'HS256',
          expiresIn
        },
        (error, token) => {
          if (error) {
            reject(error)
            return
          }

          resolve(token)
        }
      )
    })
  }
}
