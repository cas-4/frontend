import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';

createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
)
