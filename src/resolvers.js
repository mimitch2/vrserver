/* eslint-disable camelcase */
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

import { generateQueryParams, updateRelease, sortByGenreArtist } from './helpers/helpers.js';
import Rating from './Schemas/Rating.schema.js';
import Release from './Schemas/Release.schema.js';
import User from './Schemas/User.schema.js';
import UserCopy from './Schemas/UserCopy.schema.js';

const { DISCOGS_ENDPOINT, JWT_SECRET } = process.env;

const getFolders = async (__, ___, context) => {
    const { username, Authorization } = context;

    const response = await fetch(`${DISCOGS_ENDPOINT}/users/${username}/collection/folders`, {
        headers: {
            Authorization,
        },
    });

    const result = await response.json();

    return result.folders || [];
};

const getCollection = async (__, { folder, page, per_page, sort, sort_order }, context) => {
    const queryParams = generateQueryParams({
        params: {
            page,
            per_page,
            sort,
            sort_order,
        },
    });
    const { username, Authorization } = context;

    const response = await fetch(
        `${DISCOGS_ENDPOINT}/users/${username}/collection/folders/${folder}/releases${queryParams}`,
        {
            headers: {
                Authorization,
            },
        }
    );

    const result = await response.json();

    return result;
};

const getWantList = async (__, { page, per_page, sort, sort_order }, context) => {
    const isCustomWantListSorted = sort === 'genre/artist';

    const queryParams = generateQueryParams(
        isCustomWantListSorted
            ? {
                  params: { page, per_page: 500, sort: 'added', sort_order },
              }
            : {
                  params: {
                      page,
                      per_page,
                      sort,
                      sort_order,
                  },
              }
    );

    const { username, Authorization } = context;

    try {
        const response = await fetch(`${DISCOGS_ENDPOINT}/users/${username}/wants${queryParams}`, {
            headers: {
                Authorization,
            },
        });

        const result = await response.json();

        const { wants } = result;

        return isCustomWantListSorted
            ? {
                  wants: sortByGenreArtist({ arr: wants, sortOrder: sort_order }),
                  pagination: result.pagination,
              }
            : result;
    } catch (error) {
        console.warn(error);
    }

    return null;
};

const getRelease = async (__, { id }, context) => {
    const { username, Authorization } = context;

    try {
        const response = await fetch(`${DISCOGS_ENDPOINT}/releases/${id}`, {
            headers: { Authorization },
        });
        const discogsRelease = await response.json();
        const release = await Release.findOne({ releaseId: id }).populate({
            path: 'vinylRatings',
            populate: {
                path: 'user',
            },
        });

        if (release) {
            const user = await User.findOne({ username });
            const userCopy = await UserCopy.findOne({ releaseId: id, user });
            const userRating = await Rating.findOne({ user });

            const {
                artist,
                title,
                ratingsCount,
                ratingAvg,
                quietnessAvg,
                flatnessAvg,
                clarityAvg,
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
                    userCopy,
                    currentUserRating: userRating || null,
                    vinylRatings: release.vinylRatings || null,
                },
            };
        }
        return { ...discogsRelease, vinylRatingsRelease: null };
    } catch (error) {
        console.log('🚀 ~ file: resolvers.js ~ line 73 ~ getRelease ~ error', error);
    }
    return null;
};

const addRelease = async (__, { releaseId, title, artist }, context) => {
    const { username } = context;

    const user = await User.findOne({ username });

    let userCopy = await UserCopy.findOne({ releaseId, user });
    let release = await Release.findOne({ releaseId });

    if (!release) {
        release = await Release.create({ releaseId, title, artist });
    }

    if (!userCopy) {
        userCopy = await UserCopy.create({
            releaseId,
            washedOn: '',
            release,
            user,
        });
    }

    return release;
};

const addRating = async (__, { releaseId, clarity, quietness, flatness, notes }, context) => {
    const ratings = { clarity, quietness, flatness };
    const { username } = context;

    try {
        const user = await User.findOne({ username });
        const release = await Release.findOne({ releaseId });

        const rating = await Rating.create({
            ...ratings,
            rating: ((clarity + quietness + flatness) / 3).toFixed(1),
            notes,
            release,
            user,
        });

        await updateRelease({
            ratings,
            notes,
            release,
        });

        user.releasesRated += 1;

        await user.save();

        return rating;
    } catch (error) {
        const errorMessage = `Failed to create rating: ${error}`;
        console.error(errorMessage);
    }

    return null;
};

const addWashedOn = async (__, { releaseId, washedOn }) => {
    console.log(
        '🚀 ~ file: resolvers.js ~ line 212 ~ addWashedOn ~ releaseId, washedOn',
        releaseId,
        washedOn
    );
    let userCopy = await UserCopy.findOne({ releaseId });

    if (!userCopy) {
        userCopy = await UserCopy.create({ releaseId, washedOn });
    }

    userCopy.washedOn = washedOn;

    await userCopy.save();

    return userCopy;
};

const getUser = async (__, { auth }) => {
    if (!auth) {
        return null;
    }
    const parsedAuth = JSON.parse(auth);
    const parsedUsername = jwt.verify(parsedAuth.username, JWT_SECRET);

    const user = await User.findOne({ username: parsedUsername }).populate({
        path: 'vinylRatings',
        populate: {
            path: 'user',
        },
    });

    return user;
};

export const resolvers = {
    Query: {
        getFolders,
        getCollection,
        getWantList,
        getRelease,
        getUser,
    },
    Mutation: {
        addRelease,
        addRating,
        addWashedOn,
    },
};
