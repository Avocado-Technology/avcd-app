import '@testing-library/jest-dom'

// Mock environment variables
process.env.AUTH0_SECRET = 'test-secret-key-for-auth0-testing-only-32-chars-long'
process.env.AUTH0_BASE_URL = 'http://localhost:3000'
process.env.AUTH0_ISSUER_BASE_URL = 'https://test.auth0.com'
process.env.AUTH0_CLIENT_ID = 'test-client-id'
process.env.AUTH0_CLIENT_SECRET = 'test-client-secret'
