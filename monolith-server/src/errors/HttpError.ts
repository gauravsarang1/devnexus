export class HttpError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;

        // Fix prototype chain (important in TS)
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
