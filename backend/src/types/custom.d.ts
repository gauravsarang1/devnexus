// types/custom.d.ts
declare namespace Express {
    export interface Request {
        userId?: string,
        validated?: {
            body?: any,
            query?: any,
            params?: any
        }
    }
}
