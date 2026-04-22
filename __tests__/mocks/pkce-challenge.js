/** Stub for tests — MCP SDK pulls pkce-challenge ESM which Jest cannot parse without extra transform config. */
module.exports = {
  generateChallenge: async () => ({
    code_challenge: "stub",
    code_challenge_method: "S256",
  }),
};
