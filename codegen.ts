import type { CodegenConfig } from '@graphql-codegen/cli';

const apiUrl = "http://cas-sanluca.lab.students.cs.unibo.it:3000/api"

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
