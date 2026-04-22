const { NextResponse } = require("next/server");

/** Default Jest stub for `@/lib/auth0` — override per test with jest.mock */
module.exports = {
  auth0: {
    getSession: jest.fn(),
    getAccessToken: jest.fn(),
    middleware: jest.fn(async () => NextResponse.next()),
  },
};
