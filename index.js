import { ApolloServer } from 'apollo-server';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { resolvers } from './src/resolvers.js';

dotenv.config();

mongoose.Promise = global.Promise;

const url = process.env.MONGO_DB;

mongoose.connect(url, { useNewUrlParser: true });
mongoose.connection.once('open', () => console.log(`Connected to mongo at ${url}`));

const typeDefs = readFileSync('./src/typeDefs.graphql', 'UTF-8');
const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
