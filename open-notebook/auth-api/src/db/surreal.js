const { Surreal } = require('surrealdb')
const WebSocket = require('ws')
const { env } = require('../config/env')

const surreal = new Surreal()

async function initSurreal() {
  if (!global.WebSocket) {
    global.WebSocket = WebSocket
  }
  try {
    await surreal.connect(env.SURREAL_URL)

    const signinAttempts = [
      { username: env.SURREAL_USER, password: env.SURREAL_PASS },
      { user: env.SURREAL_USER, pass: env.SURREAL_PASS },
      {
        username: env.SURREAL_USER,
        password: env.SURREAL_PASS,
        namespace: env.SURREAL_NAMESPACE,
        database: env.SURREAL_DATABASE,
      },
      {
        user: env.SURREAL_USER,
        pass: env.SURREAL_PASS,
        ns: env.SURREAL_NAMESPACE,
        db: env.SURREAL_DATABASE,
      },
      {
        user: env.SURREAL_USER,
        pass: env.SURREAL_PASS,
        NS: env.SURREAL_NAMESPACE,
        DB: env.SURREAL_DATABASE,
      },
    ]

    let signedIn = false
    let lastError = null
    for (const payload of signinAttempts) {
      try {
        await surreal.signin(payload)
        signedIn = true
        break
      } catch (signinError) {
        lastError = signinError
      }
    }

    if (!signedIn) {
      throw lastError || new Error('SurrealDB signin failed')
    }

    await surreal.use({ namespace: env.SURREAL_NAMESPACE, database: env.SURREAL_DATABASE })
    return
  } catch (error) {
    console.error('SurrealDB connection failed, retrying in 5s:', error)
    setTimeout(initSurreal, 5000)
  }
}

module.exports = { surreal, initSurreal }
