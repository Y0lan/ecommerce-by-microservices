import {CustomError} from "./custom-error";

export class NotFoundError extends CustomError {
    statusCode = 404;

    serializeErrors(): { message: string; field?: string }[] {
        return [{message: "Not Found"}];
    }

    constructor(message?: string) {
        super(message || "Route not found");
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
