import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    // Support both "Bearer <token>" and bare "<token>" formats
    let token = null
    if (authHeader) {
      token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : authHeader.trim()
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Not authorized, no token provided' })
    }

    const jwtSecret = (process.env.JWT_SECRET || '').trim()
    const decoded = jwt.verify(token, jwtSecret)
    const userId = decoded.id

    const user = await User.findById(userId).select('-password')

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Not authorized, user not found' })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('[Auth Middleware] Error:', error.message)
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized, token failed' })
  }
}