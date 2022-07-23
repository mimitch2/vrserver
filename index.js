import { ApolloServer } from 'apollo-server';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import { resolvers } from './src/resolvers.js';

dotenv.config();

const typeDefs = readFileSync('./src/typeDefs.graphql', 'UTF-8');
const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
