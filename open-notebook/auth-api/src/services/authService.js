const bcrypt = require('bcrypt')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt')
const { generateTokenPair } = require('./tokenService')
const { createSession, findSessionByJti, revokeSession } = require('../models/sessionModel')
const { findUserByEmail, findUserById } = require('../models/userModel')
const { hashToken } = require('../utils/crypto')
const { env } = require('../config/env')

function createCookieOptions(isRefresh) {
  const maxAge = isRefresh ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 15
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    maxAge,
    path: '/',
  }
}

async function loginWithPassword(email, password, meta) {
  const user = await findUserByEmail(email)
  if (!user || !user.password_hash) {
    const err = new Error('Invalid credentials')
    err.status = 401
    throw err
  }

  const ok = await bcrypt.compare(password, user.password_hash)
  if (!ok) {
    const err = new Error('Invalid credentials')
    err.status = 401
    throw err
  }

  const jwt_id = cryptoRandomId()
  const access = signAccessToken({ sub: user.id, email: user.email })
  const refresh = signRefreshToken({ sub: user.id, jti: jwt_id })

  await createSession({
    user_id: user.id,
    jwt_id,
    ip: meta.ip,
    user_agent: meta.user_agent,
    refresh_hash: hashToken(refresh),
  })

  return { user, access, refresh }
}

async function refreshSession(refreshToken) {
  const payload = verifyRefreshToken(refreshToken)
  const session = await findSessionByJti(payload.jti)
  if (!session || session.revoked_at) {
    const err = new Error('Session revoked')
    err.status = 401
    throw err
  }
  if (session.refresh_hash !== hashToken(refreshToken)) {
    const err = new Error('Invalid refresh token')
    err.status = 401
    throw err
  }
  const user = await findUserById(payload.sub)
  const newJwtId = cryptoRandomId()
  const access = signAccessToken({ sub: user.id, email: user.email })
  const refresh = signRefreshToken({ sub: user.id, jti: newJwtId })

  await revokeSession(session.id)
  await createSession({
    user_id: user.id,
    jwt_id: newJwtId,
    ip: session.ip,
    user_agent: session.user_agent,
    refresh_hash: hashToken(refresh),
  })

  return { user, access, refresh }
}

function cryptoRandomId() {
  return require('crypto').randomBytes(16).toString('hex')
}

module.exports = { loginWithPassword, refreshSession, createCookieOptions }
