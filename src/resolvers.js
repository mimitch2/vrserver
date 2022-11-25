/* eslint-disable camelcase */
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import { GraphQLScalarType, Kind, GraphQLError } from 'graphql';

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

    // const formattedResults = result.folders.map(({ name, id, count }) => ({
    //     value: id,
    //     label: name,
    //     count,
    // }));

    return result.folders || [];
};

const getCollection = async (__, { folder, page, per_page, sort, sort_order }, context) => {
    const queryParams = generateQueryParams({
        params: {
            format: 'Vinyl',
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

const getSearch = async (
    __,
    { search, type = 'release', sort, sort_order, page, per_page, offset, limit },
    context
) => {
    const queryParams = generateQueryParams({
        params: {
            format: 'vinyl',
            type,
            sort,
            sort_order,
            q: search,
            page,
            per_page,
            offset,
            limit,
        },
    });
    const { Authorization } = context;

    try {
        const response = await fetch(`${DISCOGS_ENDPOINT}/database/search${queryParams}`, {
            headers: { Authorization },
        });

        const result = await response.json();
        const formatted = result.results.map((release) => {
            const [artist, title] = release?.title?.split(' - ') ?? '';

            return {
                id: release.id,
                basic_information: {
                    ...release,
                    artists: [{ name: artist || 'Unknown' }],
                    title: title || 'Unknown',
                    styles: release.style,
                },
            };
        });

        return { pagination: result.pagination, results: formatted };
    } catch (error) {
        console.error(error);
        throw new GraphQLError(`getSearch: ${error}`);
    }
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
        console.error(error);
        throw new GraphQLError(`getWantList: ${error}`);
    }
};

const getRelease = async (__, { id }, context) => {
    const { username, Authorization } = context;

    try {
        const releaseResponse = await fetch(`${DISCOGS_ENDPOINT}/releases/${id}`, {
            headers: { Authorization },
        });

        const discogsRelease = await releaseResponse.json();

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
        console.error(error);
        throw new GraphQLError(`getRelease: ${error}`);
    }
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

const addWashedOn = async (__, { releaseId, washedOn, title, artist }, context) => {
    const { username } = context;

    try {
        const user = await User.findOne({ username });
        let userCopy = await UserCopy.findOne({ releaseId, user });

        if (!userCopy) {
            let release = await Release.findOne({ releaseId });

            if (!release) {
                release = await Release.create({ releaseId, title, artist });
            }

            userCopy = await UserCopy.create({
                releaseId,
                washedOn: '',
                release,
                user,
            });
        }

        userCopy.washedOn = washedOn;

        await userCopy.save();

        return userCopy;
    } catch (error) {
        console.warn(error);
    }

    return null;
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
        getSearch,
        getUser,
    },
    Mutation: {
        addRelease,
        addRating,
        addWashedOn,
    },
    StringOrInt: new GraphQLScalarType({
        name: 'StringOrInt',
        description: 'A String or an Int union type',
        serialize(value) {
            if (typeof value !== 'string' && typeof value !== 'number') {
                throw new Error('Value must be either a String or an Int');
            }

            if (typeof value === 'number' && !Number.isInteger(value)) {
                throw new Error('Number value must be an Int');
            }

            return value;
        },
        parseValue(value) {
            if (typeof value !== 'string' && typeof value !== 'number') {
                throw new Error('Value must be either a String or an Int');
            }

            if (typeof value === 'number' && !Number.isInteger(value)) {
                throw new Error('Number value must be an Int');
            }

            return value;
        },
        parseLiteral(ast) {
            // Kinds: http://facebook.github.io/graphql/June2018/#sec-Type-Kinds
            // ast.value is always a string
            switch (ast.kind) {
                case Kind.INT:
                    return parseInt(ast.value, 10);
                case Kind.STRING:
                    return ast.value;
                default:
                    throw new Error('Value must be either a String or an Int');
            }
        },
    }),
};
