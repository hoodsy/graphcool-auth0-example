const jwt = require('jsonwebtoken')

const users = require('models/users')

const auth = {
  async signup(parent, { input }, ctx, info) {
    const auth0User = await users.createAuth0(input)
    const user = await users.create(ctx, {
      ...input,
      auth0Id: auth0User._id
    })

    return {
      token: jwt.sign({ auth0Id: user.auth0Id }, process.env.JWT_SECRET),
      user,
    }
  },
}

module.exports = auth
