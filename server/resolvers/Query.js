// const { getUserId } = require('../modules/auth')
const { getAuth0IdFromToken } = require('services/auth0')

const Query = {
  async me(parent, args, ctx, info) {
    console.log('in me')
    const auth0Id = await getAuth0IdFromToken(ctx)
    // const auth0Id = await getUserId(ctx)
    console.log(auth0Id)
    return ctx.db.query.user({ where: { auth0Id } }, info)
  },
}

module.exports = { Query }
