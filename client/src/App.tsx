import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';

import Navbar from './components/Navbar';

import { setContext } from '@apollo/client/link/context';

// Create HTTP link for connecting to the GraphQL server
const httpLink = createHttpLink({
  uri: '/graphql', // Server endpoint
});

// Add Authorization header using the authLink
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token'); // Get token from local storage
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
