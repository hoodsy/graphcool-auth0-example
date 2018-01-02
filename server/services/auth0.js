require('isomorphic-fetch')
const jwt = require('jsonwebtoken')
const jwkRsa = require('jwks-rsa')
const { AuthenticationClient, ManagementClient } = require('auth0')

const AuthError = require('errors/AuthError')

// TODO: get signed RSA key from Auth0

const auth0 = {
  authentication: new AuthenticationClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID
  }),

  management: new ManagementClient({
    domain: process.env.AUTH0_DOMAIN,
    token: process.env.AUTH0_ACCESS_TOKEN
  })
}

async function getAuth0IdFromToken(ctx) {
  const Authorization = ctx.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    return await decodeToken(token)
  }
  else {
    throw new AuthError({ data: { token } })
  }
}

async function verifyToken(err, key) {
  if (err) {
    throw new AuthError({ message: err })
  }

  const signingKey = key.publicKey || key.rsaPublicKey
  console.log('verifying token...')
  await jwt.verify(token, signingKey,
    {
      algorithms: ['RS256'],
      audience: process.env.AUTH0_API_IDENTIFIER,
      ignoreExpiration: false,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`
    },
    async (err, decoded) => {
      if (err) {
        throw new AuthError({ data: { err } })
      }
      console.log('decoded: ', decoded)
      return decoded
    }
  )
}

async function decodeToken(token) {
  const decoded = jwt.decode(token, { complete: true })
  if (!decoded || !decoded.payload || !decoded.payload.auth0Id) {
    throw new AuthError({
      message: 'Unable to retrieve key identifier from token'
    })
  }
  // if (decoded.header.alg !== 'RS256') {
  //   throw new AuthError({
  //     message:`Wrong signature algorithm, expected RS256, got ${decoded.header.alg}`
  //   })
  // }

  const jkwsClient = jwkRsa({
    cache: true,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  })
  console.log('getting signingKey...', decoded.payload.auth0Id)
  // const res = await jkwsClient.getSigningKey(decoded.payload.auth0Id, verifyToken)
  return new Promise((resolve, reject) => {

    jkwsClient.getSigningKey(decoded.payload.auth0Id, (err, key) => {
      if (err) throw new Error(err)
      const signingKey = key.publicKey || key.rsaPublicKey
      console.log(signingKey)
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
  });

}












module.exports = { auth0, getAuth0IdFromToken }
