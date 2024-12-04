
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import cors from 'cors';

import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import { authenticateToken } from './services/auth.js';

import { dirname } from 'path'; // added
import { fileURLToPath } from 'url'; //added

const PORT = process.env.PORT || 10000;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();

const __filename = fileURLToPath(import.meta.url);// added
const __dirname = dirname(__filename);  // added
  
  app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from the frontend
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  // app.use('/graphql', expressMiddleware(server));

  app.use(
    '/graphql',
    expressMiddleware(server, {
        context: async ({ req }) => {
            const authHeader = req.headers.authorization || '';
            const user = authenticateToken(authHeader);
            if (user) {
                console.log('User added to context:', user);
            } else {
                console.log('No valid user in context');
            }
            return { user }; // Attach user to context
        },
    })
);

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }
  
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();  





