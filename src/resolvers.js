/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
//  ts-ignore
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import { GraphQLScalarType, Kind, GraphQLError } from 'graphql';
// import {
//     Resolvers,
//     QueryResolvers,
//     MutationResolvers,
//     Resolver,
//     ResolverTypeWrapper,
//     Collection,
//     QueryGetCollectionArgs,
//     CollectionInstance,
//     Folder,
// } from './generated/graphql';

import {
    generateQueryParams,
    updateRelease,
    sortByGenreArtist,
    fetchFromDiscogs,
} from './helpers/helpers.js';
import Rating from './Schemas/Rating.schema.js';
import Release from './Schemas/Release.schema.js';
import User from './Schemas/User.schema.js';
// import UserCopy from './Schemas/UserCopy.schema.js';

const { DISCOGS_ENDPOINT, JWT_SECRET } = process.env;

const getFolders = async (__, ___, context) => {
    const { username } = context;

    const result = await fetchFromDiscogs({
        url: `${DISCOGS_ENDPOINT}/users/${username}/collection/folders`,
        context,
    });

    return result?.folders ?? [];
};

const getCustomFields = async (__, ___, context) => {
    const { username } = context;

    const result = await fetchFromDiscogs({
        url: `${DISCOGS_ENDPOINT}/users/${username}/collection/fields`,
        context,
    });

    return result;
};

const getCollection = async (__, { folder, page, per_page, sort, sort_order }, context) => {
    const { username } = context;
    const queryParams = generateQueryParams({
        params: {
            format: 'Vinyl',
            page,
            per_page,
            sort,
            sort_order,
        },
    });

    const result = await fetchFromDiscogs({
        url: `${DISCOGS_ENDPOINT}/users/${username}/collection/folders/${folder}/releases${queryParams}`,
        context,
    });

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

    return {
        pagination: result.pagination,
        releases: formatted,
    };
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

    const result = await fetchFromDiscogs({
        url: `${DISCOGS_ENDPOINT}/database/search${queryParams}`,
        context,
    });

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
};

const getWantList = async (__, { page, per_page, sort, sort_order }, context) => {
    const { username } = context;
    const isCustomWantListSorted = sort === 'genre/artist';

    const queryParams = generateQueryParams(
        isCustomWantListSorted
            ? {
                  params: { page, per_page, sort: 'added', sort_order },
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

    const result = await fetchFromDiscogs({
        url: `${DISCOGS_ENDPOINT}/users/${username}/wants${queryParams}`,
        context,
    });

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
};

const getIsInWantList = async (__, { releaseId }, context) => {
    const { username } = context;

    const result = await fetchFromDiscogs({
        url: `${DISCOGS_ENDPOINT}/users/${username}/wants/${releaseId}`,
        context,
    });

    return {
        isInWantList: !result?.message,
        id: releaseId,
    };
};

const getRelease = async (__, { id }, context) => {
    const { username } = context;

    const discogsRelease = await fetchFromDiscogs({
        url: `${DISCOGS_ENDPOINT}/releases/${id}`,
        context,
    });

    const release = await Release.findOne({ releaseId: id }).populate({
        path: 'vinylRatings',
        populate: {
            path: 'user',
        },
    });

    if (release) {
        const user = await User.findOne({ username });
        // const userCopy = await UserCopy.findOne({ user });
        const userRating = await Rating.findOne({ user });

        const { artist, title, ratingsCount, ratingAvg, quietnessAvg, flatnessAvg, clarityAvg } =
            release;

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
                currentUserRating: userRating || null,
                vinylRatings: release.vinylRatings || null,
            },
        };
    }

    return { ...discogsRelease, vinylRatingsRelease: null };
};

const getReleaseReviews = async (__, { releaseId, page, per_page }, context) => {
    const queryParams = generateQueryParams({
        params: { page, per_page },
    });

    const result = await fetchFromDiscogs({
        url: `${DISCOGS_ENDPOINT}/releases/${releaseId}/reviews${queryParams}`,
        context,
    });

    return result;
};

const getReviewReplies = async (__, { reviewId, page }, context) => {
    const queryParams = generateQueryParams({
        params: { page },
    });

    const result = await fetchFromDiscogs({
        url: `${DISCOGS_ENDPOINT}/reviews/${reviewId}/replies${queryParams}`,
        context,
    });

    return result;
};

const getMasterRelease = async (__, { id }, context) => {
    const result = await fetchFromDiscogs({
        url: `${DISCOGS_ENDPOINT}/masters/${id}`,
        context,
    });

    return result;
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

    const result = await fetchFromDiscogs({
        url: `${DISCOGS_ENDPOINT}/masters/${master_id}/versions${queryParams}`,
        context,
    });

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
};

const getReleaseInCollection = async (__, { id }, context) => {
    const { username } = context;

    try {
        const result = await fetchFromDiscogs({
            url: `${DISCOGS_ENDPOINT}/users/${username}/collection/releases/${id}`,
            context,
        });

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
    try {
        const result = await fetchFromDiscogs({
            url: `${DISCOGS_ENDPOINT}/artists/${id}`,
            context,
        });

        return result;
    } catch (error) {
        console.error(error);
        throw new GraphQLError(`getRelease: ${error}`);
    }
};

const addToCollection = async (__, { releaseId, folderId }, context) => {
    const { username } = context;

    try {
        const result = await fetchFromDiscogs({
            method: 'POST',
            url: `${DISCOGS_ENDPOINT}/users/${username}/collection/folders/${folderId}/releases/${releaseId}`,
            context,
        });

        return result;
    } catch (error) {
        console.error(error);
        throw new GraphQLError(`addToCollection: ${error}`);
    }
};

const addToWantList = async (__, { releaseId, notes }, context) => {
    const { username } = context;

    try {
        const result = await fetchFromDiscogs({
            url: `${DISCOGS_ENDPOINT}/users/${username}/wants/${releaseId}`,
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notes }),
            context,
        });

        return result;
    } catch (error) {
        console.error(error);
        throw new GraphQLError(`addToWantList: ${error}`);
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

        // const user = await User.findOne({ username });
        // const userCopy = await UserCopy.findOne({ instanceId, user });
        // const release = await Release.findOne({ releaseId });

        // if (!release) {
        //     return { success: response.status === 204 };
        // }

        // if (userCopy) {
        //     await UserCopy.deleteOne({
        //         instanceId,
        //         releaseId,
        //         washedOn: '',
        //         release,
        //         user,
        //     });
        // }

        return { success: response.status === 204, id: releaseId };
    } catch (error) {
        console.error(error);
        throw new GraphQLError(`removeFromCollection: ${error}`);
    }
};

const removeFromWantList = async (__, { releaseId }, context) => {
    const { username, Authorization } = context;

    try {
        const response = await fetch(`${DISCOGS_ENDPOINT}/users/${username}/wants/${releaseId}`, {
            method: 'DELETE',
            headers: { Authorization },
        });

        return { success: response.status === 204, id: releaseId };
    } catch (error) {
        console.error(error);
        throw new GraphQLError(`remnoveFromWantList: ${error}`);
    }
};

// const addRelease = async (__, { releaseId, title, artist }, context) => {
//     // const { username } = context;

//     // const user = await User.findOne({ username });

//     // let userCopy = await UserCopy.findOne({ instanceId, user });
//     let release = await Release.findOne({ releaseId });

//     if (!release) {
//         release = await Release.create({ releaseId, title, artist });
//     }

//     // if (!userCopy) {
//     //     userCopy = await UserCopy.create({
//     //         instanceId,
//     //         releaseId,
//     //         washedOn: '',
//     //         release,
//     //         user,
//     //     });
//     // }

//     return release;
// };

const addRating = async (
    __,
    { releaseId, clarity, quietness, flatness, notes, title, artist },
    context
) => {
    const ratings = { clarity, quietness, flatness };
    const { username } = context;

    try {
        const user = await User.findOne({ username });
        const userRating = await Rating.findOne({ user });
        let release = await Release.findOne({ releaseId });
        let rating = await Rating.findOne({ user, release });
        const ratingExists = !!rating;

        if (!release) {
            release = await Release.create({ releaseId, title, artist });
        }

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

        await release.populate({
            path: 'vinylRatings',
            populate: {
                path: 'user',
            },
        });

        await updateRelease({
            ratings,
            notes,
            release,
            isUpdating: ratingExists,
        });

        return release;
    } catch (error) {
        const errorMessage = `Failed to create rating: ${error}`;
        console.error(errorMessage);
    }

    return null;
};

// const addWashedOn = async (__, { instanceId, washedOn }, context) => {
//     const { username } = context;

//     try {
//         const user = await User.findOne({ username });
//         let userCopy = await UserCopy.findOne({ instanceId, user });

//         if (!userCopy) {
//             userCopy = await UserCopy.create({
//                 instanceId,
//                 washedOn: '',
//                 user,
//             });
//         }

//         userCopy.washedOn = washedOn;

//         await userCopy.save();

//         return userCopy;
//     } catch (error) {
//         console.warn(error);
//     }

//     return null;
// };

const updateCustomField = async (__, { values, releaseId, folderId, instanceId }, context) => {
    const { username, Authorization } = context;

    try {
        const promises = values.map(({ fieldId, value }) =>
            fetch(
                `${DISCOGS_ENDPOINT}/users/${username}/collection/folders/${folderId}/releases/${releaseId}/instances/${instanceId}/fields/${fieldId}
                `,
                {
                    method: 'POST',
                    headers: { Authorization, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ value }),
                }
            )
        );

        const response = await Promise.allSettled(promises);
        const success = response.every(({ status }) => status === 'fulfilled');

        return { success };
    } catch (error) {
        console.error(error);
        throw new GraphQLError(`updateCustomField: ${error}`);
    }
};

const updateInstanceFolder = async (
    __,
    { releaseId, instanceId, folderId, newFolderId },
    context
) => {
    const { username, Authorization } = context;

    try {
        const response = await fetch(
            `${DISCOGS_ENDPOINT}/users/${username}/collection/folders/${folderId}/releases/${releaseId}/instances/${instanceId}
            `,
            {
                method: 'POST',
                headers: { Authorization, 'Content-Type': 'application/json' },
                body: JSON.stringify({ folder_id: newFolderId }),
            }
        );

        return { success: response.status === 204 };
    } catch (error) {
        console.error(error);
        throw new GraphQLError(`updateCustomField: ${error}`);
    }
};

const updateUser = async (__, { key, value }, context) => {
    const { username } = context;

    try {
        const user = await User.findOne({ username });

        if (user) {
            await user.updateOne({ username, [key]: value });
            return user;
        }

        throw new Error('Cannot updated user settings: user not found');
    } catch (error) {
        console.error(error);
        throw new Error(`updateUser: ${error}`);
    }
};

const updateWashedOnField = async (__, { value }, context) => {
    const { username } = context;

    try {
        const user = await User.findOne({ username });

        if (user) {
            await user.updateOne({ username, washedOnField: value });
            return user;
        }

        throw new Error('Cannot updated washedOnField: user not found');
    } catch (error) {
        console.error(error);
        throw new Error(`updateWashedOnFiledName: ${error}`);
    }
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

const queries = {
    getFolders,
    getCustomFields,
    getCollection,
    getWantList,
    getIsInWantList,
    getRelease,
    getReleaseReviews,
    getReviewReplies,
    getMasterRelease,
    getMasterReleaseVersions,
    getReleaseInCollection,
    getSearch,
    getUser,
    getArtist,
};

const mutations = {
    // addRelease,
    addToCollection,
    removeFromCollection,
    removeFromWantList,
    addRating,
    // addWashedOn,
    updateCustomField,
    updateInstanceFolder,
    updateUser,
    updateWashedOnField,
    addToWantList,
};

export const resolvers = {
    SearchResults: {
        __resolveType: (obj, contextValue, info) => {
            if (obj.isReleases) {
                return 'ReleasesSearchResult';
            }
            if (obj.isArtists) {
                return 'ArtistSearchResult';
            }
            // if (obj.isLabels) {
            //     return 'LabelSearchResult';
            // }
            if (obj.isMasters) {
                return 'MasterSearchResult';
            }
            return null; // GraphQLError is thrown
        },
    },
    Query: queries,
    Mutation: mutations,
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
