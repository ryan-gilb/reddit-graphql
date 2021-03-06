import { ApolloServer } from 'apollo-server-lambda';

import { typeDefs, resolvers } from './lib/schema';
import { createApi } from './lib/api';

// Workaround for node-fetch
// https://github.com/netlify/zip-it-and-ship-it/issues/67#issuecomment-549837499
require('encoding');

const api = createApi();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event }) => {
    const token = (event.headers.authorization || '').split(' ')[1];
    api.setAuth(token);
    return { api };
  },
  introspection: true,
  playground: '/graphql',
});

exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
