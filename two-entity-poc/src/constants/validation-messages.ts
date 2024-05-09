export enum ERROR_MESSAGES {
    TITLE_REQUIRED = "Title is required",
    TITLE_MIN_LENGTH = "Title must be at least 5 characters long",
    TITLE_STRING = "Title must be a string",
    TITLE_MAX_LENGTH = "Title cannot exceed 50 characters",
    IMAGE_URL_REQUIRED = "Image URL is required",
    CONTENT_REQUIRED = "Content is required",
    BLOG_ID_QUERY_PARAM_REQUIRED = "Blog ID is required as Query Param",
    BLOG_ID_PATH_PARAM_REQUIRED = "Blog ID is required as Path Param",
    BLOG_ID_INTEGER = "Expected Blog ID to be an Integer",
}
