const { Graphcool } = require('graphcool-binding')
const jwt = require('jsonwebtoken')
const jwkRsa = require('jwks-rsa')

const auth0 = require('../services/auth0')

async function getUserId(ctx) {
  const Authorization = ctx.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const decodedToken = await verifyToken(token)
    return decodedToken
  }

  throw new AuthError()
}

class AuthError extends Error {
  constructor() {
    super('Not authorized')
  }
}


const verifyToken = (token) =>
  new Promise(resolve => {

  //Decode the JWT Token
  const decoded = jwt.decode(token, { complete: true })
  if (!decoded || !decoded.header || !decoded.header.kid) {
    throw new Error('Unable to retrieve key identifier from token')
  }
  if (decoded.header.alg !== 'RS256') {
    throw new Error(
      `Wrong signature algorithm, expected RS256, got ${decoded.header.alg}`
    )
  }

  const jkwsClient = jwkRsa({
    cache: true,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  })

  //Retrieve the JKWS's signing key using the decode token's key identifier (kid)
  jkwsClient.getSigningKey(decoded.header.kid, (err, key) => {
    if (err) throw new Error(err)
    const signingKey = key.publicKey || key.rsaPublicKey
    //If the JWT Token was valid, verify its validity against the JKWS's signing key
    jwt.verify(
      token,
      signingKey,
      {
        algorithms: ['RS256'],
        audience: process.env.AUTH0_API_IDENTIFIER,
        ignoreExpiration: false,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`
      },
      (err, decoded) => {
        if (err) throw new Error(err)
        return resolve(decoded)
      }
    )
  })
})

module.exports = {
  getUserId,
  AuthError
}
