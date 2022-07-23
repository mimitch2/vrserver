import fetch from 'node-fetch';
import Release from './Schemas/Releases.schema.js';

const getCollection = async () => {
    const response = await fetch(
        `${process.env.DISCOGS_ENDPOINT}/users/mimitch/collection/folders/0/releases`,
        {
            headers: {
                Authorization:
                    'OAuth oauth_consumer_key="rpNwDmvmQlrBcrLBkmnp", oauth_nonce="1658521337301", oauth_token="pLMFKBIxbOcHeiFxdWZASaaFaoTXBvjHuBXCHZSA", oauth_signature="XsIZccmJNpUHbRTvKjOuXFbeMAcPoJhB&gDJnWPzTlPzZMxqDUYqreLwIPZfgAAHPSrNHDZsF",oauth_signature_method="PLAINTEXT",oauth_timestamp="1658521337301"'
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

export const resolvers = { Query: { getCollection, getRelease } };
