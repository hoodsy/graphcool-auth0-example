const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { auth0 } = require('../../services/auth0')

const auth = {
  async signup(parent, { input }, ctx, info) {
    const password = await bcrypt.hash(input.password, 10)

    const auth0User = await auth0.authentication.database.signUp({
      password,
      email: input.email,
      connection: 'Username-Password-Authentication',
      // For extra user fields in Auth0:
      // user_metadata: {}
    })

    const user = await ctx.db.mutation.createUser({
      data: {
        ...input,
        password,
        auth0Id: auth0User._id,
      },
    })

    return {
      token: jwt.sign({ userId: user.auth0Id }, process.env.JWT_SECRET),
      user,
    }
  },
  //
  // async login(parent, { email, password }, ctx, info) {
  //   const user = await ctx.db.query.user({ where: { email } })
  //   if (!user) {
  //     throw new Error(`No such user found for email: ${email}`)
  //   }
  //
  //   const valid = await bcrypt.compare(password, user.password)
  //   if (!valid) {
  //     throw new Error('Invalid password')
  //   }
  //
  //   return {
  //     token: jwt.sign({ userId: user.auth0Id }, process.env.JWT_SECRET),
  //     user,
  //   }
  // },
}

module.exports = { auth }
