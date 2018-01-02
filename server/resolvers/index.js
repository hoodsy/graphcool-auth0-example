const auth = require('./Mutation/auth')
const users = require('./Query/users')

module.exports = {
  Query: {
    ...users
  },
  Mutation: {
    ...auth,
  },
}
