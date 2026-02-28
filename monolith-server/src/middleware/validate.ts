
// middlewares/validate.ts
import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
    (schema: ZodObject) => (req: Request, _res: Response, next: NextFunction) => {
        try {
            // Cast req to any to assign custom 'validated' property and access body/params/query
            req.validated = schema.parse({
                body: req.body,
                params: req.params,
                query: req.query,
            });
            // Cast next to any to resolve "no call signatures" error
            next();
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            next(error);
        }
    };