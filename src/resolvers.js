/* eslint-disable camelcase */
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import Rating from './Schemas/Rating.schema.js';
import Release from './Schemas/Releases.schema.js';
import User from './Schemas/User.schema.js';
import { generateQueryParams, updateRelease } from './helpers/helpers.js';

const getFolders = async (_, __, context) => {
    const { username, Authorization } = context;

    const response = await fetch(
        `${process.env.DISCOGS_ENDPOINT}/users/${username}/collection/folders`,
        {
            headers: {
                Authorization
            }
        }
    );

    const result = await response.json();

    return result.folders || [];
};

const getCollection = async (__, { folder, page, per_page, sort, sort_order }, context) => {
    const queryParams = generateQueryParams({
        params: {
            page,
            per_page,
            sort,
            sort_order
        }
    });
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

const getRelease = async (__, { id }, context) => {
    const { username, Authorization } = context;

    try {
        const response = await fetch(`${process.env.DISCOGS_ENDPOINT}/releases/${id}`, {
            headers: { Authorization }
        });

        const discogsRelease = await response.json();
        const release = await Release.findOne({ releaseId: id });

        if (release) {
            await release.populate({
                path: 'vinylRatings',
                populate: {
                    path: 'user'
                }
            });
            const user = await User.findOne({ username });
            const userRating = await Rating.findOne({ user });
            const {
                artist,
                title,
                ratingsCount,
                ratingAvg,
                quietnessAvg,
                flatnessAvg,
                clarityAvg,
                washedAt
            } = release;

            return {
                ...discogsRelease,
                vinylRatingsRelease: {
                    artist,
                    title,
                    ratingsCount,
                    ratingAvg,
                    quietnessAvg,
                    flatnessAvg,
                    clarityAvg,
                    washedAt,
                    currentUserRating: userRating || null,
                    vinylRatings: release.vinylRatings
                }
            };
        }
        return { ...discogsRelease, vinylRatingsRelease: null };
    } catch (error) {
        console.log('🚀 ~ file: resolvers.js ~ line 73 ~ getRelease ~ error', error);
    }
    return null;
};

const addRelease = async (__, { releaseId, title, artist }) => {
    let release = await Release.findOne({ releaseId });

    if (!release) {
        release = await Release.create({ releaseId, title, artist });
    }

    return release;
};

const addRating = async (__, { releaseId, clarity, quietness, flatness, notes }, context) => {
    const ratings = { clarity, quietness, flatness };
    const { username } = context;
    const user = await User.findOne({ username });
    const release = await Release.findOne({ releaseId });

    try {
        const rating = await Rating.create({
            ...ratings,
            notes,
            release,
            user
        });

        await updateRelease({
            ratings,
            notes,
            release
        });

        user.releasesRated = user.releasesRated += 1;
        await user.save();

        return rating;
    } catch (error) {
        const errorMessage = `Failed to create rating: ${error}`;
        console.error(errorMessage);
    }

    return null;
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
    Query: {
        getFolders,
        getCollection,
        getRelease,
        getUser
    },
    Mutation: {
        addRelease,
        addRating
    }
};
