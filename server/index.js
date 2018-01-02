const { GraphQLServer } = require('graphql-yoga')
const { Graphcool } = require('graphcool-binding')
const jwt = require('express-jwt')
const jwtAuthz = require('express-jwt-authz')
const jwks = require('jwks-rsa')
const { formatError } = require('apollo-errors')

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
// server.express.use(formatError)
server.start(() => console.log('Server is running on http://localhost:4000'))
