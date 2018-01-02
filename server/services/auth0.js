require('isomorphic-fetch')
const jwt = require('jsonwebtoken')
const jwkRsa = require('jwks-rsa')
const { AuthenticationClient, ManagementClient } = require('auth0')

const AuthError = require('errors/AuthError')

const authentication = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID
})

const management = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  token: process.env.AUTH0_ACCESS_TOKEN
})

module.exports = {
  async getAuth0IdFromToken(ctx) {
    const Authorization = ctx.request.get('Authorization')
    if (Authorization) {
      const token = Authorization.replace('Bearer ', '')
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET)

      if (!verifiedToken.auth0Id) {
        throw new AuthError('Invalid token')
      }

      return verifiedToken
    }
    else {
      throw new AuthError({ data: { token } })
    }
  },

  async createAuth0User(user) {
    return await authentication.database.signUp({
      password: user.password,
      email: user.email,
      connection: 'Username-Password-Authentication',
      // For extra user fields in Auth0:
      // user_metadata: {}
    })
  },

  async getAuth0Token(user) {
    try {
      const res = await authentication.database.signIn({
        password: user.password,
        username: user.email,
        connection: 'Username-Password-Authentication',
      })
      console.log(res)

    } catch (e) {
      console.error(e)
    }
    return res
  },
}
