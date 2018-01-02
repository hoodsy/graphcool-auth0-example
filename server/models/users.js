const { auth0 } = require('services/auth0')

const users = {
  async getByEmail(ctx, email) {
    return await ctx.db.query.user({ where: { email } })
  },

  async getByAuth0Id(ctx, auth0Id) {
    return await ctx.db.query.user({ where: { auth0Id } })
  },

  async create(ctx, user) {
    return await ctx.db.mutation.createUser({ data: { ...user } })
  },
}

module.exports = users
