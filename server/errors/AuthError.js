const { createError } = require('apollo-errors')

const AuthError = createError('AuthError', {
  message: 'User not authorized'
})

module.exports = AuthError
