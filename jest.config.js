/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFiles: ['<rootDir>/jest.polyfills.cjs'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@ai-sdk/react$': '<rootDir>/__tests__/mocks/ai-sdk-react.ts',
    '^pkce-challenge$': '<rootDir>/__tests__/mocks/pkce-challenge.js',
    // ESM-only packages — SWC doesn't rewrite bare specifiers, so these patterns fire correctly.
    '^marked$': '<rootDir>/__tests__/mocks/marked.js',
    '^react-markdown$': '<rootDir>/__tests__/mocks/react-markdown.js',
    '^remark-gfm$': '<rootDir>/__tests__/mocks/remark-gfm.js',
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.(spec|test).[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(@auth/core|next-auth|jose|d3-org-chart|d3-flextree|@modelcontextprotocol|pkce-challenge|marked|react-markdown|remark-gfm|remark-parse|remark-rehype|unified|bail|is-plain-obj|trough|vfile|vfile-message|unist-util-stringify-position|unist-util-visit|unist-util-position-from-estree|unist-builder|hast-util-to-jsx-runtime|hast-util-to-html|hast-util-from-html|html-url-attributes|mdast-util-to-hast|mdast-util-from-markdown|micromark|decode-named-character-reference|character-entities|devlop)/)',
  ],
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
}

module.exports = createJestConfig(customJestConfig)
