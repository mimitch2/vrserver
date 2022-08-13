/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
import jwt from 'jsonwebtoken';
import _ from 'lodash';

export const generateQueryParams = ({ params }) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    _.reduce(
        params,
        (result, val, key) => {
            let encodedKeyValue = '';
            const dividerSymbol = result ? '&' : '?';

            if (_.isArray(val)) {
                const arrayString = `[${val.join(',').replace(',', '||')}]`;

                encodedKeyValue = `${encodeURIComponent(key)}=${arrayString}`;
            } else {
                encodedKeyValue = `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
            }

            return `${result}${dividerSymbol}${encodedKeyValue}`;
        },
        ''
    );
export const getDiscogsHeadersAndUsername = ({ auth }) => {
    const consumerKey = process.env.DISCOGS_API_KEY;
    const consumerSecret = process.env.DISCOGS_SECRET;
    const token = jwt.verify(auth.token, process.env.JWT_SECRET);
    const secret = jwt.verify(auth.secret, process.env.JWT_SECRET);
    const username = jwt.verify(auth.username, process.env.JWT_SECRET);

    return {
        username,
        Authorization: `OAuth oauth_consumer_key="${consumerKey}", oauth_nonce="${Date.now()}", oauth_token="${token}", oauth_signature="${consumerSecret}&${secret}",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now()}"`
    };
};

export const updateRelease = async ({ ratings = null, release, releaseData }) => {
    if (!ratings) {
        _.forEach(releaseData, (value, key) => {
            release[key] = value;
        });
        await release.save();
        return;
    }
    const numberOfRatings = Object.keys(ratings).length;

    const { ratingAvg } = release;

    const newRatingsTotal = ratings.reduce((sum, rating) => sum + rating, 0);
    const newRatingsOverallAverage = (newRatingsTotal / numberOfRatings).toFixed(1);
    const newRatingsCount = (release.ratingsCount += 1);

    const overallAverage =
        newRatingsCount > 1
            ? ((newRatingsOverallAverage + ratingAvg) / 2).toFixed(1)
            : newRatingsOverallAverage;

    release.overallRatingAverage = overallAverage;
    release.ratingsCount = newRatingsCount;

    _.forEach(ratings, (value, key) => {
        const averageKey = `${key}Avg`;
        const average = (newRatingsCount > 1 ? (value + release[averageKey]) / 2 : value).toFixed(
            1
        );

        release[averageKey] = average;
    });

    await release.save();
};
