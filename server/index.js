const { GraphQLServer } = require('graphql-yoga')
const { Graphcool } = require('graphcool-binding')
const jwt = require('express-jwt')
const jwtAuthz = require('express-jwt-authz')
const jwks = require('jwks-rsa')

const resolvers = require('./resolvers')

const server = new GraphQLServer({
  typeDefs: './server/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Graphcool({
      typeDefs: './database/schema.generated.graphql',
      endpoint: process.env.GRAPHCOOL_ENDPOINT,
      secret: process.env.GRAPHCOOL_SECRET,
    }),
  })
})

// const jwtCheck = jwt({
//   secret: jwks.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: "https://graphcool-auth0-example.auth0.com/.well-known/jwks.json"
//   }),
//   audience: 'http:localhost:4000',
//   issuer: "https://graphcool-auth0-example.auth0.com/",
//   algorithms: ['RS256']
// })
//
// const checkScopes = jwtAuthz([ 'read:messages' ])

// server.express.use(jwtCheck)
server.start(() => console.log('Server is running on http://localhost:4000'))
