/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR 💥', err);
  }

  // Prisma duplicate key error
  if (err.code === 11000) {
    const value = err.keyValue ? Object.values(err.keyValue)[0] : 'value';
    error = new AppError(`Duplicate field value: ${value}. Please use another value.`, 400);
  }

  // Prisma validation / record not found errors
  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2025') {
      error = new AppError('Record not found', 404);
    }
    if (err.code === 'P2002') {
      error = new AppError('Unique constraint violation', 400);
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired. Please log in again.', 401);
  }

  // Better Auth / Validation errors
  if (err.message?.includes('Missing or null Origin')) {
    error = new AppError('Invalid request origin', 403);
  }

  // Default to 500 if statusCode not set
  if (!error.statusCode) {
    error.statusCode = 500;
    error.status = 'error';
    error.message = process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message || 'Internal Server Error';
  }

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};