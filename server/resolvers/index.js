const { Query } = require('./Query')
const { AuthPayload } = require('./AuthPayload')
const auth = require('./Mutation/auth')

module.exports = {
  Query,
  Mutation: {
    ...auth,
  },
  AuthPayload,
}
