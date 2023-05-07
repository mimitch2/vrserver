/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import Rating from '../Schemas/Rating.schema.js';
export const generateQueryParams = ({ params }) => _.reduce(params, (result, val, key) => {
    let encodedKeyValue = '';
    const dividerSymbol = result ? '&' : '?';
    if (Array.isArray(val)) {
        const arrayString = `[${val.join(',').replace(',', '||')}]`;
        encodedKeyValue = `${encodeURIComponent(key)}=${arrayString}`;
    }
    else {
        encodedKeyValue = `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
    }
    return `${result}${dividerSymbol}${encodedKeyValue}`;
}, '');
export const getDiscogsHeadersAndUsername = ({ auth }) => {
    const consumerKey = process.env.DISCOGS_API_KEY;
    const consumerSecret = process.env.DISCOGS_SECRET;
    const token = jwt.verify(auth.token, process.env.JWT_SECRET);
    const secret = jwt.verify(auth.secret, process.env.JWT_SECRET);
    const username = jwt.verify(auth.username, process.env.JWT_SECRET);
    return {
        username,
        Authorization: `OAuth oauth_consumer_key="${consumerKey}", oauth_nonce="${Date.now()}", oauth_token="${token}", oauth_signature="${consumerSecret}&${secret}",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now()}"`,
    };
};
export const updateRelease = async ({ ratings = null, release, releaseData, isUpdating }) => {
    if (!ratings) {
        _.forEach(releaseData, (value, key) => {
            release[key] = value;
        });
        await release.save();
        return;
    }
    const releaseRatings = await Rating.find({ release });
    const ratingTypeTotals = releaseRatings.reduce((result, rating) => {
        result.quietness += rating.quietness;
        result.clarity += rating.clarity;
        result.flatness += rating.flatness;
        result.total = result.total + rating.quietness + rating.clarity + rating.flatness;
        return result;
    }, {
        quietness: 0,
        flatness: 0,
        clarity: 0,
        total: 0,
    });
    const ratingTypeCount = Object.keys(ratings).length;
    const newRatingsTotal = _.reduce(ratings, (sum, value) => sum + value, 0);
    const newRatingsAvg = +(newRatingsTotal / ratingTypeCount).toFixed(1);
    const newRatingsCount = isUpdating ? +release.ratingsCount : +(release.ratingsCount += 1);
    const hasBeenRated = newRatingsCount > 1;
    release.ratingAvg = hasBeenRated
        ? (ratingTypeTotals.total / newRatingsCount / ratingTypeCount).toFixed(1)
        : newRatingsAvg;
    release.ratingsCount = newRatingsCount;
    _.forEach(ratingTypeTotals, (value, key) => {
        if (key === 'total') {
            return false;
        }
        const averageKey = `${key}Avg`;
        const average = (hasBeenRated ? value / newRatingsCount : value).toFixed(1);
        release[averageKey] = average;
    });
    await release.save();
};
export const sortByGenreArtist = ({ arr, sortOrder }) => {
    const sorted = arr.sort((a, b) => {
        const aName = a.basic_information.artists[0].name.replace('The ', '');
        const bName = b.basic_information.artists[0].name.replace('The ', '');
        return (a.basic_information.genres[0].localeCompare(b.basic_information.genres[0]) ||
            aName.localeCompare(bName));
    });
    return sorted;
};
// export const sortByGenreArtist = ({ arr, sortOrder }) => {
//     const sorted = arr.sort((a, b) => {
//         const firstCompare = sortOrder === 'asc' ? a : b;
//         const secondCompare = sortOrder === 'asc' ? b : a;
//         const firstName = firstCompare.basic_information.artists[0].name.replace('The ', '');
//         const secondName = secondCompare.basic_information.artists[0].name.replace('The ', '');
//         return (
//             firstCompare.basic_information.genres[0].localeCompare(
//                 secondCompare.basic_information.genres[0]
//             ) || firstName.localeCompare(secondName)
//         );
//     });
//     return sorted;
// };
