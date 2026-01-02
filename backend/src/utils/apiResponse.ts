
import { Response } from 'express';

/**
 * JSON value type for type-safe response building
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

/**
 * Success response builder for Express responses
 * Standardizes API response format across all endpoints
 *
 * @template T - Type of the response data
 * @param res - Express Response object
 * @param data - The data to include in the response
 * @param message - Optional success message (default: "Request successful")
 * @param status - HTTP status code (default: 200)
 */
export function successResponse<T extends JsonValue | object>(
  res: Response,
  data: T,
  message: string = 'Request successful',
  status: number = 200
): Response {
  // Cast res to any to access status method
  return (res as any).status(status).json({
    success: true,
    message,
    data,
  });
}

/**
 * Error response builder for Express responses
 * Standardizes error response format across all endpoints
 *
 * @template E - Type of the error details
 * @param res - Express Response object
 * @param message - Error message (default: "Something went wrong")
 * @param status - HTTP status code (default: 400)
 * @param errors - Optional error details (e.g., validation errors)
 */
export function errorResponse<E extends JsonValue | object>(
  res: Response,
  message: string = 'Something went wrong',
  status: number = 400,
  errors?: E
): Response {
  // Cast res to any to access status method
  return (res as any).status(status).json({
    success: false,
    message,
    errors: errors ?? {},
  });
}
