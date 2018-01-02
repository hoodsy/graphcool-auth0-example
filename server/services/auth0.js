require('isomorphic-fetch')
const jwt = require('jsonwebtoken')
const jwkRsa = require('jwks-rsa')
const { AuthenticationClient, ManagementClient } = require('auth0')

const AuthError = require('errors/AuthError')

const auth0 = {
  authentication: new AuthenticationClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID
  }),

  management: new ManagementClient({
    domain: process.env.AUTH0_DOMAIN,
    token: process.env.AUTH0_ACCESS_TOKEN
  })
}

async function getAuth0IdFromToken(ctx) {
  const Authorization = ctx.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    return jwt.verify(token, process.env.JWT_SECRET)
  }
  else {
    throw new AuthError({ data: { token } })
  }
}

module.exports = { auth0, getAuth0IdFromToken }
