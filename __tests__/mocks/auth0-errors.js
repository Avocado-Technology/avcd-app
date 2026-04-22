/** CJS shim for Auth0 errors subpath so Jest does not load ESM `dist/errors/index.js`. */
class AccessTokenError extends Error {
  constructor(code, message, cause) {
    super(message);
    this.name = "AccessTokenError";
    this.code = code;
    if (cause !== undefined) this.cause = cause;
  }
}

const AccessTokenErrorCode = {
  MISSING_SESSION: "missing_session",
  MISSING_REFRESH_TOKEN: "missing_refresh_token",
  FAILED_TO_REFRESH_TOKEN: "failed_to_refresh_token",
};

module.exports = {
  AccessTokenError,
  AccessTokenErrorCode,
};
