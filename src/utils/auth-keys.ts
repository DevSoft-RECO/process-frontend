const PREFIX = import.meta.env.VITE_STORAGE_PREFIX || 'hija_default_'; 

export const AUTH_KEYS = {
    ACCESS_TOKEN: `${PREFIX}access_token`,
    USER_DATA: `${PREFIX}user_data`,
    PKCE_VERIFIER: `${PREFIX}pkce_verifier`,
    AUTH_REDIRECT: `${PREFIX}auth_redirect_to`,
    SSO_LOCK: `${PREFIX}is_redirecting_to_sso`,
    STORAGE_VERSION: `${PREFIX}storage_version`
};
