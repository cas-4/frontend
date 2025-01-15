// src/apollo-client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error('VITE_API_URL is not defined. Check your .env file.');
}

const httpLink = createHttpLink({
  uri: `${apiUrl}/graphql`, // GraphQL server URL
});

const authLink = setContext((_, { headers }) => {
  // Ensure that the token is correctly fetched from 'accessToken'
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '', // Attach the Bearer token
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
