const { verifyAccessToken } = require('../utils/jwt')
const { findUserById } = require('../models/userModel')

async function auth(req, res, next) {
  try {
    const token = req.cookies.access_token || ''
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const payload = verifyAccessToken(token)
    const user = await findUserById(payload.sub)
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

module.exports = { auth }
