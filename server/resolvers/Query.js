const { getAuth0IdFromToken } = require('services/auth0')

const Query = {
  async me(parent, args, ctx, info) {
    const { auth0Id } = await getAuth0IdFromToken(ctx)
    return ctx.db.query.user({ where: { auth0Id } }, info)
  },
}

module.exports = { Query }
