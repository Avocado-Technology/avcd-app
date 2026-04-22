/** Manual mock for Jest — avoids loading real Auth0 SDK + jose ESM chain. */
class MockAccessTokenError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "AccessTokenError";
    this.code = code;
  }
}

module.exports = {
  getAccessToken: jest.fn(),
  getSession: jest.fn(),
  AccessTokenError: MockAccessTokenError,
};
