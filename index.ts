import { ApolloServer } from '@apollo/server';
import { GraphQLError } from 'graphql';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { readFileSync } from 'fs';
import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';
import { getDiscogsHeadersAndUsername } from './src/helpers/helpers.js';

import authRouter from './src/Routes/auth.routes.js';
import { resolvers } from './src/resolvers.js';

// import cors from 'cors';
// import bodyparser from 'body-parser';

// const key = readFileSync('./src/certs/selfsigned.key');
// const cert = readFileSync('./src/certs/selfsigned.crt');
// const options = {
//     key,
//     cert
// };

mongoose.Promise = global.Promise;

const url = process.env.MONGO_DB;
// @ts-ignore
mongoose.connect(url, { useNewUrlParser: true });
mongoose.connection.once('open', () => console.log(`Connected to mongo at ${url}`));
// @ts-ignore
const typeDefs = readFileSync('./src/typeDefs.graphql', 'UTF-8');
const app = express();

// app.use(bodyparser);
// app.use(authRouter);
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
    status400ForVariableCoercionErrors: true,
});

await server.start();

app.use(
    '/graphql',
    cors(),
    authRouter,
    bodyParser.json(),
    expressMiddleware(server, {
        // @ts-ignore
        context: ({ req }) => {
            const auth = req?.headers?.authorization ?? '';

            if (auth) {
                const authJson = auth.split(' ')[1];
                const parsedAuth = JSON.parse(authJson);
                const { username, Authorization } = getDiscogsHeadersAndUsername({
                    auth: parsedAuth,
                });

                return { username, Authorization };
            }

            throw new GraphQLError('You must be logged in');
        },
    })
);

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
});
