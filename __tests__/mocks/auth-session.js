/** Default Jest stub for `@/lib/auth/session` — override per test with jest.mock */
module.exports = {
  getSession: jest.fn(),
  getAccessToken: jest.fn(),
};
