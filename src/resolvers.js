/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
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

    try {
        const response = await fetch(
            `${DISCOGS_ENDPOINT}/users/${username}/collection/folders/${folder}/releases${queryParams}`,
            {
                headers: {
                    Authorization,
                },
            }
        );

        const result = await response.json();

        const formatted =
            (await Promise.all(
                result?.releases?.map(async (release) => {
                    const VrRelease = await Release.findOne({ releaseId: release.id });

                    return {
                        ...release,
                        rating: VrRelease?.ratingAvg ?? 0,
                        basic_information: {
                            ...release.basic_information,
                            type: 'release',
                        },
                    };
                })
            )) ?? [];

        return { pagination: result.pagination, releases: formatted };
    } catch (error) {
        console.error(error);
        throw new GraphQLError(`getSearch: ${error}`);
    }
};

const getSearch = async (
    __,
    { search, type, sort, sort_order, page, per_page, offset, limit },
    context
) => {
    const params = {
        type,
        sort,
        sort_order,
        page,
        per_page,
        offset,
        limit,
        q: search,
    };

    if (type === 'release') {
        params.format = 'vinyl';
    }
    const queryParams = generateQueryParams({
        params,
    });
    const { Authorization } = context;

    try {
        const response = await fetch(`${DISCOGS_ENDPOINT}/database/search${queryParams}`, {
            headers: { Authorization },
        });

        const result = await response.json();

        let formatted = [];

        if (type === 'release' || type === 'master') {
            formatted = await Promise.all(
                result?.results?.map(async (release) => {
                    const vrRelease = await Release.findOne({ releaseId: release.id });

                    const [artist, title] = release?.title?.split?.(' - ') ?? '';

                    return {
                        id: release.id,
                        rating: vrRelease?.ratingAvg ?? 0,
                        basic_information: {
                            ...release,
                            artists: [{ name: artist || 'Unknown' }],
                            title: title || 'Unknown',
                            styles: release.style,
                        },
                    };
                })
            );
        } else if (type === 'artist') {
            formatted = await result.results;
        }

        let typeKey;

        switch (type) {
            case 'release':
                typeKey = 'isReleases';
                break;
            case 'artist':
                typeKey = 'isArtists';
                break;
            case 'master':
                typeKey = 'isMasters';
                break;
            case 'label':
                typeKey = 'isLabels';
                break;
            default:
                typeKey = 'isReleases';
        }

        return { [typeKey]: true, pagination: result.pagination, results: formatted };
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

        const formatted =
            (await Promise.all(
                result?.wants?.map(async (release) => {
                    const vrRelease = await Release.findOne({ releaseId: release.id });

                    return {
                        ...release,
                        rating: vrRelease?.ratingAvg ?? 0,
                    };
                })
            )) ?? [];

        return isCustomWantListSorted
            ? {
                  wants: sortByGenreArtist({ arr: formatted, sortOrder: sort_order }),
                  pagination: result.pagination,
              }
            : { pagination: result.pagination, wants: formatted };
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

const getMasterRelease = async (__, { id }, context) => {
    const { Authorization } = context;

    try {
        const response = await fetch(`${DISCOGS_ENDPOINT}/masters/${id}`, {
            headers: { Authorization },
        });

        const result = await response.json();

        return result;
    } catch (error) {
        console.error(error);
        throw new GraphQLError(`getMasterRelease: ${error}`);
    }
};

const getMasterReleaseVersions = async (
    __,
    { master_id, page, per_page, sort, sort_order, released, country },
    context
) => {
    const queryParams = generateQueryParams({
        params: {
            format: 'Vinyl',
            page,
            per_page,
            sort,
            sort_order,
            // released,
            // country,
        },
    });
    const { Authorization } = context;

    try {
        const response = await fetch(
            `${DISCOGS_ENDPOINT}/masters/${master_id}/versions${queryParams}`,
            {
                headers: {
                    Authorization,
                },
            }
        );

        const result = await response.json();

        const formatted =
            (await Promise.all(
                result?.versions?.map(async (version) => {
                    const vrRelease = await Release.findOne({ releaseId: version.id });

                    return {
                        id: version.id,
                        rating: vrRelease?.ratingAvg ?? 0,
                        basic_information: {
                            ...version,
                            user_data: version.stats.user,
                            label: version.label.split(', ') ?? [],
                            format: version.format.split(', ') ?? [],
                            styles: [],
                            genres: [],
                            formats: [],
                            artists: [],
                        },
                    };
                })
            )) ?? [];

        return { pagination: result.pagination, versions: formatted };
    } catch (error) {
        console.error(error);
        throw new GraphQLError(`getSearch: ${error}`);
    }
};

const getReleaseInCollection = async (__, { id }, context) => {
    const { username, Authorization } = context;

    try {
        const response = await fetch(
            `${DISCOGS_ENDPOINT}/users/${username}/collection/releases/${id}`,
            {
                headers: { Authorization },
            }
        );

        const result = await response.json();
        console.log('🚀 ~ file: resolvers.js:356 ~ getReleaseInCollection ~ result:', result);

        return {
            isInCollection: !!result?.releases?.length ?? false,
            pagination: result.pagination,
            releases: result.releases,
        };
    } catch (error) {
        console.error(error);
        throw new GraphQLError(`getRelease: ${error}`);
    }
};

const getArtist = async (__, { id }, context) => {
    const { Authorization } = context;

    try {
        const response = await fetch(`${DISCOGS_ENDPOINT}/artists/${id}`, {
            headers: { Authorization },
        });

        const result = await response.json();

        return result;
    } catch (error) {
        console.error(error);
        throw new GraphQLError(`getRelease: ${error}`);
    }
};

const addToCollection = async (__, { releaseId, folderId }, context) => {
    const { username, Authorization } = context;

    try {
        const response = await fetch(
            `${DISCOGS_ENDPOINT}/users/${username}/collection/folders/${folderId}/releases/${releaseId}`,
            {
                method: 'POST',
                headers: { Authorization },
            }
        );

        const result = await response.json();

        return result;
    } catch (error) {
        console.error(error);
        throw new GraphQLError(`getSearch: ${error}`);
    }
};

const removeFromCollection = async (__, { folderId, releaseId, instanceId }, context) => {
    const { username, Authorization } = context;

    try {
        const response = await fetch(
            `${DISCOGS_ENDPOINT}/users/${username}/collection/folders/${folderId}/releases/${releaseId}/instances/${instanceId}
            `,
            {
                method: 'DELETE',
                headers: { Authorization },
            }
        );

        const user = await User.findOne({ username });
        const userCopy = await UserCopy.findOne({ releaseId, user });
        const release = await Release.findOne({ releaseId });

        if (!release) {
            return { isGood: response.status === 204 };
        }

        if (userCopy) {
            await UserCopy.deleteOne({
                releaseId,
                washedOn: '',
                release,
                user,
            });
        }

        return { isGood: response.status === 204 };
    } catch (error) {
        console.error(error);
        throw new GraphQLError(`removeFromCollection: ${error}`);
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
        let rating = await Rating.findOne({ user, release });
        const ratingExists = !!rating;

        if (ratingExists) {
            Object.entries(ratings).forEach(([key, value]) => {
                rating[key] = value;
            });
            rating.notes = notes;
            rating.rating = ((clarity + quietness + flatness) / 3).toFixed(1);

            await rating.save();
        } else {
            rating = await Rating.create({
                ...ratings,
                rating: ((clarity + quietness + flatness) / 3).toFixed(1),
                notes,
                release,
                user,
            });

            user.releasesRated += 1;

            await user.save();
        }

        await updateRelease({
            ratings,
            notes,
            release,
            isUpdating: ratingExists,
        });

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
    SearchResults: {
        __resolveType(obj, contextValue, info) {
            if (obj.isReleases) {
                return 'ReleasesSearchResult';
            }
            if (obj.isArtists) {
                return 'ArtistSearchResult';
            }
            if (obj.isLabels) {
                return 'LabelSearchResult';
            }
            if (obj.isMasters) {
                return 'MasterSearchResult';
            }
            return null; // GraphQLError is thrown
        },
    },
    Query: {
        getFolders,
        getCollection,
        getWantList,
        getRelease,
        getMasterRelease,
        getMasterReleaseVersions,
        getReleaseInCollection,
        getSearch,
        getUser,
        getArtist,
    },
    Mutation: {
        addRelease,
        addToCollection,
        removeFromCollection,
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
