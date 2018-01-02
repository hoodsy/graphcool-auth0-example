const jwt = require('jsonwebtoken')

const auth0 = require('services/auth0')
const users = require('models/users')
const AuthError = require('errors/AuthError')

module.exports = {
  async signup(parent, { input }, ctx, info) {
    let user = await users.getByEmail(ctx, input.email)

    if (user) {
      throw new AuthError({
        message: 'A user with that email already exists'
      })
    }

    const auth0User = await auth0.createAuth0User(input)
    user = await users.create(ctx, {
      ...input,
      auth0Id: auth0User._id
    })

    return {
      token: jwt.sign({ auth0Id: user.auth0Id }, process.env.JWT_SECRET),
      user,
    }
  },

  async login(parent, { input }, ctx, info) {
    let user = await users.getByEmail(ctx, input.email)
    console.log(user, input)

    if (!user) {
      throw new AuthError({
        message: 'No user with that email exists'
      })
    }

    const userData = await auth0.getAuth0Token(input)
    console.log(userData)
    if (userData.err) {
      throw new AuthError({
        message: 'Invalid password or email combination'
      })
    }

    return {
      user,
      token: userData.token
    }
  }
}
