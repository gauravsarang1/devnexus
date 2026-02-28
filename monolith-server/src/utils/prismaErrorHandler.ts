

export interface PrismaError {
  code: string;
  message: string;
  meta?: any;
}

/**
 * Handles Prisma-specific errors and returns appropriate error responses
 * Maps Prisma error codes to HTTP status codes and messages
 *
 * @param error - Prisma error object
 * @param res - Express Response object
 * @returns Formatted error response
 */
export const prismaErrorHandler = (error: any): { status: number; message: string; errors?: any } => {
  // Log the error for debugging
  console.error('🔴 Prisma Error:', error.code, error.message);

  switch (error.code) {
    // Record not found
    case 'P2025':
      return {
        status: 404,
        message: 'Record not found',
      };

    // Unique constraint violation (duplicate value)
    case 'P2002':
      const fields = error.meta?.target || [];
      return {
        status: 400,
        message: `Duplicate value for field(s): ${fields.join(', ')}`,
        errors: { field: fields[0], code: 'UNIQUE_CONSTRAINT' },
      };

    // Foreign key constraint violation
    case 'P2003':
      return {
        status: 400,
        message: 'Invalid reference to related record',
        errors: { code: 'FOREIGN_KEY_CONSTRAINT' },
      };

    // Required field missing
    case 'P2011':
      return {
        status: 400,
        message: 'Required field is missing',
        errors: { code: 'MISSING_REQUIRED_FIELD' },
      };

    // Type validation error
    case 'P2012':
      return {
        status: 400,
        message: 'Invalid data type provided',
        errors: { code: 'TYPE_VALIDATION_ERROR' },
      };
    
    case 'P2014':
      return {
        status: 400,
        message: 'violate the required relation',
        errors: { code: ''}
      }

    // Operation timed out
    case 'P2024':
      return {
        status: 504,
        message: 'Database operation timed out',
        errors: { code: 'TIMEOUT' },
      };

    // Database connection error
    case 'P1000':
    case 'P1001':
    case 'P1002':
      return {
        status: 503,
        message: 'Database connection failed',
        errors: { code: 'DATABASE_CONNECTION_ERROR' },
      };

    // Default error
    default:
      console.error('Unknown Prisma error:', error);
      return {
        status: 500,
        message: 'An unexpected database error occurred',
        errors: { code: 'INTERNAL_SERVER_ERROR', message: error.message },
      };
  }
};

