import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:8080/graphql/query',
  documents: ['src/main/graphql/**/*.graphql'],
  generates: {
    'src/shared/graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typed-document-node',
      ],
      config: {
        scalars: {
          Time: 'string',
        },
      },
    },
  },
  hooks: {},
};

export default config;


