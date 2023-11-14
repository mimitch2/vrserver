import express from 'express';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import User from '../Schemas/User.schema.js';

const router = express.Router();
dotenv.config();

if (!process.env.DISCOGS_API_KEY) {
    throw new Error('No Discogs Consumer Key available');
}
if (!process.env.DISCOGS_SECRET) {
    throw new Error('No Discogs Consumer Secret available');
}

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
    throw new Error('No JWT_SECRET provided');
}

const consumerKey = process.env.DISCOGS_API_KEY;
const consumerSecret = process.env.DISCOGS_SECRET;

let discogsAuthTokenSecret;
let discogsAuthRequestToken;
let discogsAccessTokenSecret;
let discogsAccessToken;

router.get('/auth', async (req, res, next) => {
    const callbackUrl =
        process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'
            ? `https://${req.hostname}`
            : `http://${req.hostname}:${process.env.PORT || 8080}`;
    console.log('🚀 ~ file: auth.routes.js:33 ~ router.get ~ callbackUrl:', callbackUrl);

    try {
        const tokenResponse = await fetch(`${process.env.DISCOGS_ENDPOINT}/oauth/request_token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `OAuth oauth_consumer_key="${consumerKey}",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now()}",oauth_nonce="${Date.now()}",oauth_version="1.0",oauth_signature="${consumerSecret}&", oauth_callback="${callbackUrl}/return"`,
            },
        });

        const token = await tokenResponse.text();
        const params = new URLSearchParams(token);
        discogsAuthRequestToken = params.get('oauth_token');
        discogsAuthTokenSecret = params.get('oauth_token_secret');
        res.send(`https://discogs.com/oauth/authorize?oauth_token=${discogsAuthRequestToken}`);
    } catch (error) {
        next(res.status(500).send('Internal Server Error'));
    }
});

router.get('/return', async (req, res, next) => {
    const { oauth_verifier: oAuthVerifier } = req.query;

    try {
        const tokenResponse = await fetch('https://api.discogs.com/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `OAuth oauth_consumer_key="${consumerKey}",oauth_nonce="${Date.now()}",oauth_token="${discogsAuthRequestToken}", oauth_signature=${consumerSecret}&${discogsAuthTokenSecret}",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now()}",oauth_verifier="${oAuthVerifier}"`,
            },
        });

        const responseToken = await tokenResponse.text();
        const params = new URLSearchParams(responseToken);
        discogsAccessToken = params.get('oauth_token');
        discogsAccessTokenSecret = params.get('oauth_token_secret');

        const identityResponse = await fetch('https://api.discogs.com/oauth/identity', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `OAuth oauth_consumer_key="${consumerKey}", oauth_nonce="${Date.now()}", oauth_token="${discogsAccessToken}", oauth_signature="${consumerSecret}&${discogsAccessTokenSecret}",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now()}"`,
            },
        });

        const identity = await identityResponse.json();
        const { username } = identity;

        const userResponse = await fetch(`https://api.discogs.com/users/${username}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `OAuth oauth_consumer_key="${consumerKey}", oauth_nonce="${Date.now()}", oauth_token="${discogsAccessToken}", oauth_signature="${consumerSecret}&${discogsAccessTokenSecret}",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now()}"`,
            },
        });

        const userData = await userResponse.json();

        if (discogsAccessToken && discogsAccessTokenSecret && userData) {
            const {
                id: discogsUserId,
                name,
                email,
                uri: discogsUserInfoUri,
                releases_rated: discogsReleasesRated,
            } = userData;
            const token = jwt.sign(discogsAccessToken, JWT_SECRET);
            const secret = jwt.sign(discogsAccessTokenSecret, JWT_SECRET);
            const signedUsername = jwt.sign(identity.username, JWT_SECRET);
            const user = await User.findOne({ username });

            if (!user) {
                try {
                    await User.create({
                        username,
                        email,
                        name,
                        discogsUserInfoUri,
                        discogsReleasesRated,
                        token,
                        discogsUserId,
                        releasesRated: 0,
                        avatarUrl: userData?.avatar_url || null,
                        washedOnField: '',
                    });
                } catch (error) {
                    const errorMessage = `Failed to create new user: ${error}`;
                    console.error(errorMessage);
                    res.status(500).send(errorMessage);
                }
            } else {
                user.avatarUrl = userData?.avatar_url || null;
                await user.save();
            }

            const cookie = JSON.stringify({
                username: signedUsername,
                token,
                secret,
            });

            const appUri =
                process.env.NODE_ENV === 'development'
                    ? 'exp://192.168.4.137:19000/--'
                    : 'vinylratings://';
            // const appUri = 'vinylratings://';
            res.redirect(`${appUri}/home?auth=${cookie}`);
        }
    } catch (error) {
        next(res.status(500).send('Internal Server Error'));
    }
});

export default router;
