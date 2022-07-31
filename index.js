import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer, AuthenticationError } from 'apollo-server-core';
import { readFileSync } from 'fs';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { getDiscogsHeadersAndUsername, generateQueryParams } from './src/helpers/auth.helpers.js';

// import cors from 'cors';
// import bodyparser from 'body-parser';

import authRouter from './src/Routes/auth.routes.js';
import { resolvers } from './src/resolvers.js';

mongoose.Promise = global.Promise;

const url = process.env.MONGO_DB;

mongoose.connect(url, { useNewUrlParser: true });
mongoose.connection.once('open', () => console.log(`Connected to mongo at ${url}`));

const typeDefs = readFileSync('./src/typeDefs.graphql', 'UTF-8');
const app = express();

// app.use(bodyparser);
app.use(authRouter);
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });
// app.use(cors({ origin: ['http://localhost:3000', 'https://vinylratings.com'] }));

const httpServer = http.createServer(app);
const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => {
        const token = req?.headers?.authorization ?? '';

        if (token) {
            const json = token.split(' ')[1];
            const parsedAuth = JSON.parse(json);
            const { username, Authorization } = getDiscogsHeadersAndUsername({ auth: parsedAuth });

            return { username, Authorization };
        }

        throw new AuthenticationError('you must be logged in');
    }
});

await server.start();

server.applyMiddleware({ app });

// eslint-disable-next-line no-promise-executor-return
await new Promise((resolve) => httpServer.listen({ port: process.env.PORT }, resolve));
console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
