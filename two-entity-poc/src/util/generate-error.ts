export const getErrorObject = (errMsg: string, statusCode: number) => {
    const error = new Error(errMsg);
    (error as any).statusCode = statusCode;
    return error;
}