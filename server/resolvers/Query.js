const { getUserId } = require('../modules/auth')

const Query = {
  async me(parent, args, ctx, info) {
    const userId = await getUserId(ctx)
    // console.log(userId)
    return ctx.db.query.user({ where: { userId } }, info)
  },
}

module.exports = { Query }
