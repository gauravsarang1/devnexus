
import { z } from "zod";

/**
 * Standard Zod schema for MongoDB ObjectIds
 * 24-character hexadecimal string
 */
export const objectId = z.string().regex(
  /^[0-9a-fA-F]{24}$/,
  "Invalid MongoDB ObjectId"
);
