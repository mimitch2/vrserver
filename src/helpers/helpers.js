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

export const updateRelease = async ({ stars = null, release, releaseData }) => {
    if (!stars) {
        _.forEach(releaseData, (value, key) => {
            release[key] = value;
        });
        await release.save();
        return;
    }
    const numberOfStars = Object.keys(stars).length;

    release.ratingsCount = release.ratingsCount += 1;
    const { overallRatingTotal, ratingsCount } = release;
    const { quietness, flatness, clarity } = stars;

    const newRatingsTotal = quietness + flatness + clarity;
    const newRatingsOverallAverage = (newRatingsTotal / numberOfStars).toFixed(1);

    const overallAverage =
        ratingsCount > 1
            ? ((overallRatingTotal + newRatingsTotal) / ratingsCount / numberOfStars).toFixed(1)
            : newRatingsOverallAverage;

    release.overallRatingAverage = overallAverage;
    release.overallRatingTotal += newRatingsTotal;

    _.forEach(stars, (value, key) => {
        const averageKey = `${key}Average`;
        const totalKey = `${key}Total`;
        const average = (
            ratingsCount > 1 ? (value + release[totalKey]) / ratingsCount : value
        ).toFixed(1);

        release[averageKey] = average;
        release[totalKey] = release[totalKey] += value;
    });

    await release.save();
};
