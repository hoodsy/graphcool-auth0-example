const { getUserId, Context } = require('../utils')

const Query = {
  me(parent, args, ctx, info) {
    console.log('ME QUERY')
    console.log('headers: ', ctx.headers)
    return 'ME RETURN VALUE'
    // const id = getUserId(ctx)
    // return ctx.db.query.user({ where: { id } }, info)
  },
}

module.exports = { Query }
