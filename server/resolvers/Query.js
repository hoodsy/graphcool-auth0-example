const { getAuth0IdFromToken } = require('services/auth0')
const users = require('models/users')

const Query = {
  async me(parent, args, ctx, info) {
    const { auth0Id } = await getAuth0IdFromToken(ctx)
    return await users.getByAuth0Id(ctx, auth0Id)
  },
}

module.exports = { Query }
