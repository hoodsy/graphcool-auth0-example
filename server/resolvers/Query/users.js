const auth0 = require('services/auth0')
const users = require('models/users')

module.exports = {
  async me(parent, args, ctx, info) {
    const { auth0Id } = await auth0.getAuth0IdFromToken(ctx)
    return await users.getByAuth0Id(ctx, auth0Id)
  },
}
