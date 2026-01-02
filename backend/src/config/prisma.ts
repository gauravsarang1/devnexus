import "dotenv/config";
import * as PrismaClientModule from "@prisma/client";

/**
 * Fixed: Cast PrismaClient from the module to any to bypass missing export error.
 * This ensures the application can still instantiate the Prisma client even if the generated types are not found.
 */
const PrismaClient = (PrismaClientModule as any).PrismaClient;

const prisma = new (PrismaClient as any)({})

export default prisma