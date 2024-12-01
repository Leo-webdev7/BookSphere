/* import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
}); */

/* import express from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import db from './config/connection.js';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';
import { authenticateToken } from './services/auth.js';


const app = express();
const PORT = process.env.PORT || 3001

// Middleware for parsing incoming requests 



// Serve static assets if in production



// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization;
        const user = authenticateToken(authHeader);
        return { user }; // Add user to the GraphQL context
      },
    })
  );

  // Start the server once the database is connected
  db.on('error', (err) => {
  console.error('Database connection error:', err);
});

db.once('open', () => {
  console.log('Database connected successfully!');
  app.listen(PORT, () => {
    console.log(`🌍 Server listening on http://localhost:${PORT}`);
    console.log(`🚀 GraphQL endpoint ready at http://localhost:${PORT}/graphql`);
  });
});
}

await startServer(); */


import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';

import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  app.use('/graphql', expressMiddleware(server));

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }
  
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();