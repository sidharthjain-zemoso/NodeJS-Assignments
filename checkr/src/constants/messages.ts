export const ErrorMessages = {
    SOMETHING_WENT_WRONG: 'Something went wrong',

    errorFetching: (key: string) => `Error while fetching ${key}`,
    errorPerformingAction: (action: string) => `Error while performing ${action}`,
    errorAdding: (key: string) => `Error while adding ${key}`,
    errorDeleting: (key: string) => `Error while deleting ${key}`
}

export const SuccessMessages = {
    fetched: (key: string) => `${key} fetched successfully`,
    actionPerformed: (action: string) => `${action} performed successfully`,
    added: (key: string) => `${key} added successfully`,
    deleted: (key: string) => `${key} deleted successfully`,
    export: (key: string) => `${key} exported successfully`,
    loggedIn: (key: string) => `${key} logged in successfully`,
    signedUp: (key: string) => `${key} signed up successfully`,
    reset: (key: string) => `${key} reset successfully`
}

export const validationErrorMessages = {}