export const ERROR_MESSAGES = {
    getQeryParamErrorMessage (key: string): string {
        return `${key} is required as Query Param`;
    },

    getPathParamErrorMessage (key: string): string {
        return `${key} is required as Path Param`;
    },

    getDataTypeErrorMessage (key: string, type: string): string {
        return `${key} must be of type ${type}`;
    },

    getRequiredErrorMessage (key: string): string {
        return `${key} is required`;
    },

    getMinStringErrorMessage (key: string, len: number): string {
        return `${key} must be at least ${len} characters long`;
    },

    getMaxStringErrorMessage (key: string, len: number): string {
        return `${key} cannot exceed ${len} characters`;
    }
}
