import type { CodegenConfig } from '@graphql-codegen/cli';

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error('VITE_API_URL is not defined. Check your .env file.');
}

const config: CodegenConfig = {
  overwrite: true,
  schema: `${apiUrl}/graphql`, // GraphQL server URL
  documents: "src/**/*.tsx",
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
    }
  }
};

export default config;
