// import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
// import { userInfo } from 'os';
dotenv.config();


interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

export const authenticateToken = (authHeader: string | undefined): JwtPayload | null => {
  if (!authHeader) {
    console.log('No auth header found');
    return null; // no token provided
  }

  const token = authHeader.split(' ')[1]; // Expecting "Bearer <token>"
  const secretKey = process.env.JWT_SECRET_KEY || '';
  console.log('JWT Secret Key:', secretKey); // This should print your secret key

  try {
    const user = jwt.verify(token, secretKey) as JwtPayload;
    return user;
  } catch (err) {
    console.error('Invalid or expired token:', err);
    return null; // Invalid or expired token
  }
};

export const signToken = (username: string, email: string, _id: string): string => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}
