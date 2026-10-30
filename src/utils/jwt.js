import jwt from 'jsonwebtoken'

import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js'

/**
 * Generate a JWT token
 * @param {object|string|Buffer} payload - Data to be encoded in token
 * @param {object} [options] - Additional JWT options
 * @returns {Promise<string>} Signed JWT token
 */

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: JWT_EXPIRES_IN,
  })
}
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET, {
    algorithms: ['HS256'],
  })
}

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @param {object} [options] - Additional JWT verify options
 * @returns {Promise<object>} Decoded payload
 */

class JwtHelper {
  static async sign(payload) {
    return generateToken(payload)
  }

  static async verify(token) {
    return verifyToken(token)
  }
}

export { generateToken, verifyToken, JwtHelper }
