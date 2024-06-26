class CustomError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number, error?: any) {
        if (error instanceof CustomError) {
            throw error;
        } else {
            super(message);
            this.statusCode = statusCode;
        }
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default CustomError;
