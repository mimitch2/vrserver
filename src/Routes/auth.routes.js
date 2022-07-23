import express from 'express';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

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
    console.log('XXXXXXXX');
    try {
        const tokenResponse = await fetch('https://api.discogs.com/oauth/request_token', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `OAuth oauth_consumer_key="${consumerKey}",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now()}",oauth_nonce="${Date.now()}",oauth_version="1.0",oauth_signature="${consumerSecret}&", oauth_callback="http://${
                    req.hostname
                }:${process.env.PORT}/return"`
            }
        });

        const token = await tokenResponse.text();
        const params = new URLSearchParams(token);
        discogsAuthRequestToken = params.get('oauth_token');
        discogsAuthTokenSecret = params.get('oauth_token_secret');
        console.log(discogsAuthRequestToken);
        res.send(`https://discogs.com/oauth/authorize?oauth_token=${discogsAuthRequestToken}`);
    } catch (error) {
        next(res.status(500).send('Internal Server Error'));
    }
});

router.get('/return', async (req, res, next) => {
    console.log('ZZZZZZZZZ');
    const { oauth_verifier: oAuthVerifier } = req.query;

    try {
        const tokenResponse = await fetch('https://api.discogs.com/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `OAuth oauth_consumer_key="${consumerKey}",oauth_nonce="${Date.now()}",oauth_token="${discogsAuthRequestToken}", oauth_signature=${consumerSecret}&${discogsAuthTokenSecret}",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now()}",oauth_verifier="${oAuthVerifier}"`
            }
        });

        const responseToken = await tokenResponse.text();
        const params = new URLSearchParams(responseToken);
        discogsAccessToken = params.get('oauth_token');
        discogsAccessTokenSecret = params.get('oauth_token_secret');

        const identityResponse = await fetch('https://api.discogs.com/oauth/identity', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `OAuth oauth_consumer_key="${consumerKey}", oauth_nonce="${Date.now()}", oauth_token="${discogsAccessToken}", oauth_signature="${consumerSecret}&${discogsAccessTokenSecret}",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now()}"`
            }
        });
        const identity = await identityResponse.json();
        const { username } = identity;
        const discogsUserId = identity.id;

        const userResponse = await fetch(`https://api.discogs.com/users/${username}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `OAuth oauth_consumer_key="${consumerKey}", oauth_nonce="${Date.now()}", oauth_token="${discogsAccessToken}", oauth_signature="${consumerSecret}&${discogsAccessTokenSecret}",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now()}"`
            }
        });

        const userData = await userResponse.json();

        if (discogsAccessToken && discogsAccessTokenSecret) {
            const token = jwt.sign(discogsAccessToken, JWT_SECRET);
            const secret = jwt.sign(discogsAccessTokenSecret, JWT_SECRET);
            const signedUsername = jwt.sign(identity.username, JWT_SECRET);
            // const user = await User.findOne({ username });

            // if (!user) {
            //     try {
            //         await User.create({
            //             username,
            //             discogsUserId,
            //             releasesRated: 0,
            //             avatarUrl: userData?.avatar_url || null
            //         });
            //     } catch (error) {
            //         const errorMessage = `Failed to create new user: ${error}`;
            //         console.error(errorMessage);
            //         res.status(500).send(errorMessage);
            //     }
            // } else {
            //     user.avatarUrl = userData?.avatar_url || null;
            //     await user.save();
            // }

            // res.cookie(
            //   'auth',
            //   JSON.stringify({
            //     username: signedUsername,
            //     token: token,
            //     secret: secret
            //   }),
            //   { httpOnly: true }
            // );

            const cookie = JSON.stringify({
                username: signedUsername,
                token,
                secret
            });

            // console.log(
            //   JSON.stringify({
            //     username: signedUsername,
            //     token: token,
            //     secret: secret
            //   })
            // );

            res.redirect(`vinylratings://home?auth=${cookie}`);
            // res.redirect(`http://localhost:3000`);
        }
    } catch (error) {
        next(res.status(500).send('Internal Server Error'));
    }
});

export default router;
