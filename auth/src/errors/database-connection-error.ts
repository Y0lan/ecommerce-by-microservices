import {CustomError} from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    reason: string = 'Error while connecting to database'
    statusCode: number = 500
    constructor() {
        super('Error while connecting to database')
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }
    serializeErrors() {
        return [
            {
                message: this.reason,
            }
        ]
    }
}

