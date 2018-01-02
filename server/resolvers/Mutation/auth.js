const jwt = require('jsonwebtoken')

const users = require('models/users')
const AuthError = require('errors/AuthError')

const auth = {
  async signup(parent, { input }, ctx, info) {
    console.log(input)
    let user = await users.getByEmail(ctx, input.email)

    if (user) {
      throw new AuthError({
        message: 'A user with that email already exists'
      })
    }

    const auth0User = await users.createAuth0(input)
    user = await users.create(ctx, {
      ...input,
      auth0Id: auth0User._id
    })

    return {
      token: jwt.sign({ auth0Id: user.auth0Id }, process.env.JWT_SECRET),
      user,
    }
  },

  // async login(parent, { input }, ctx, info) {
  //   let user = await users.getByEmail(ctx, input.email)
  //
  //   if (!user) {
  //     throw new AuthError({
  //       message: 'No user with that email exists'
  //     })
  //   }
  //
  //   const userData = await users.getAuth0Token(input)
  //   if (userData.err) {
  //     throw new AuthError({
  //       message: 'Invalid password or email combination'
  //     })
  //   }
  //   console.log(userData)
  //
  //   return {
  //     user,
  //     token: userData.token
  //   }
  // }
}

module.exports = auth
