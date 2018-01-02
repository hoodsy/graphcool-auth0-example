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

  async createAuth0(user) {
    return await auth0.authentication.database.signUp({
      password: user.password,
      email: user.email,
      connection: 'Username-Password-Authentication',
      // For extra user fields in Auth0:
      // user_metadata: {}
    })
  },

  async getAuth0Token(user) {
    return await auth0.authentication.database.signIn({
      password: user.password,
      email: user.email,
      connection: 'Username-Password-Authentication',
    })
  },
}

module.exports = users
