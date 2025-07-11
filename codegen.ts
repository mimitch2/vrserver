import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    schema: './src/typeDefs.graphql',
    generates: {
        'src/generated/graphql.ts': {
            config: {
                useIndexSignature: true,
            },
            plugins: ['typescript', 'typescript-resolvers', 'typescript-mongodb'],
        },
    },
};

export default config;
