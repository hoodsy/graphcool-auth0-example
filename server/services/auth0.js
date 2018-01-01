require('isomorphic-fetch')
const { AuthenticationClient, ManagementClient } = require('auth0')

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

module.exports = { auth0 }
