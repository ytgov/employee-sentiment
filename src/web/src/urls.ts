import * as config from "./config";

export const PROFILE_URL = `${config.apiBaseUrl}/api/user/me`;
export const USERS_URL = `${config.apiBaseUrl}/api/user`;
export const HEALTHCHECK_URL = `${config.apiBaseUrl}/api/healthcheck`;

// App specific URLS

export const QUESTION_URL = `${config.apiBaseUrl}/api/question`;
export const PARTICIPANT_URL = `${config.apiBaseUrl}/api/participant`;
export const ANSWER_URL = `${config.apiBaseUrl}/api/answer`;
export const RATING_URL = `${config.apiBaseUrl}/api/rating`;
