import { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';
import { errorResponse } from '../utils/apiResponse.js';
import { ZodError } from 'zod';
import { PrismaError, prismaErrorHandler } from '../utils/prismaErrorHandler.js';
import * as PrismaModule from '@prisma/client';
import { HttpError } from "../errors/HttpError.js";


/**
 * Fixed: Cast Prisma from module to any to bypass missing export error.
 * This allows access to Prisma error types for instanceof checks.
 */
const Prisma = (PrismaModule as any).Prisma || PrismaModule;

/**
 * Enhanced Request Logger Middleware
 * Logs method, path, status code, and response time
 */
// Explicitly typing as RequestHandler helps the compiler match the correct app.use overload
export const requestLogger: RequestHandler = (req, res, next) => {
  const start = Date.now();

  // Listen for when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const timestamp = new Date().toISOString();

    // Choose emoji & color based on success/failure
    const statusEmoji = status >= 400 ? '❌' : '✅';
    const methodColor = '\x1b[36m'; // cyan
    const resetColor = '\x1b[0m';

    console.log(
      `${statusEmoji} [${timestamp}] ${methodColor}${req.method}${resetColor} ${req.path} → ${status} (${duration}ms)`
    );
  });

  next();
};

/**
 * Error handling middleware
 * Catches all errors and sends appropriate error responses
 * Must be registered last in the middleware stack
 */
// Explicitly typing as ErrorRequestHandler ensures the 4-argument signature is recognized correctly
export const errorHandler: ErrorRequestHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('❌ Unhandled Error:', err.message || err);
  if (err.stack) console.error(err.stack);

  // Handle Zod validation errors
  if (err instanceof ZodError) {

    console.error('🔴 Validation Error Details:', err.message);
    
    return errorResponse(
      res,
      'Validation failed',
      400,
      { errors: err.message }
    ) as any;
  }

  // Handle Prisma errors
  if (err instanceof (Prisma as any).PrismaClientKnownRequestError || err instanceof (Prisma as any).PrismaClientUnknownRequestError) {
    const prismaError = prismaErrorHandler(err);

    console.error('🔴 Prisma Error Details:', prismaError);
    
    return errorResponse(
      res,
      prismaError.message,
      prismaError.status,
      prismaError.errors
    ) as any;
  }


  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message || 'Internalq server error',
    });
  }

  // Send error response with 500 status
  return errorResponse(
    res,
    'Internal server error',
    500,
    { message: err.message || 'Unknown error' }
  ) as any;
};

/**
 * 404 Not Found middleware
 * Handles requests to undefined routes
 */
// Explicitly typing as RequestHandler for clarity and type safety
export const notFound: RequestHandler = (req, res) => {
  console.warn(`⚠️  Route not found: ${req.method} ${req.path}`);
  return errorResponse(
    res,
    'Route not found',
    404,
    { path: req.path, method: req.method }
  ) as any;
};