/* eslint-disable camelcase */
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import Rating from './Schemas/Rating.schema.js';
import Release from './Schemas/Releases.schema.js';
import User from './Schemas/User.schema.js';
import { generateQueryParams } from './helpers/helpers.js';

const getCollection = async (__, { folder, page, per_page, offset, limit }, context) => {
    const queryParams = generateQueryParams({ params: { page, per_page } });
    const { username, Authorization } = context;

    const response = await fetch(
        `${process.env.DISCOGS_ENDPOINT}/users/${username}/collection/folders/${folder}/releases${queryParams}`,
        {
            headers: {
                Authorization
            }
        }
    );

    const result = await response.json();

    return result;
};

const getRelease = async (__, { releaseId }) => {
    const release = await Release.findOne({ releaseId });

    return release;
};

const addRelease = async (__, args) => {
    const release = await Release.create({ ...args });

    return release;
};

const getUser = async (__, { auth }) => {
    if (!auth) {
        return null;
    }
    const parsedAuth = JSON.parse(auth);
    const parsedUsername = jwt.verify(parsedAuth.username, process.env.JWT_SECRET);

    const user = await User.findOne({ username: parsedUsername }).populate({
        path: 'vinylRatings',
        populate: {
            path: 'user'
        }
    });

    return user;
};

export const resolvers = {
    Query: { getCollection, getRelease, getUser },
    Mutation: {
        addRelease
    }
};
