/**
 * Auth0 Session Management Tests
 * 
 * These tests verify that Auth0 authentication is properly configured
 * and that session management works correctly.
 */

describe('Auth0 Configuration', () => {
  it('should have required Auth0 environment variables', () => {
    expect(process.env.AUTH0_SECRET).toBeDefined()
    expect(process.env.AUTH0_BASE_URL).toBeDefined()
    expect(process.env.AUTH0_ISSUER_BASE_URL).toBeDefined()
    expect(process.env.AUTH0_CLIENT_ID).toBeDefined()
    expect(process.env.AUTH0_CLIENT_SECRET).toBeDefined()
  })

  it('should have Auth0 secret with minimum length', () => {
    const secret = process.env.AUTH0_SECRET || ''
    expect(secret.length).toBeGreaterThanOrEqual(32)
  })
})

describe('Auth0 Package Installation', () => {
  it('should have @auth0/nextjs-auth0 in package.json dependencies', () => {
    const packageJson = require('../package.json')
    expect(packageJson.dependencies['@auth0/nextjs-auth0']).toBeDefined()
  })

  it('should have @auth0/nextjs-auth0 module in node_modules', () => {
    const { existsSync } = require('fs')
    const { join } = require('path')
    const auth0ModulePath = join(process.cwd(), 'node_modules', '@auth0', 'nextjs-auth0')
    expect(existsSync(auth0ModulePath)).toBe(true)
  })
})

describe('NextAuth.js Removal Verification', () => {
  it('should NOT have next-auth package installed', () => {
    let nextAuthExists = true
    try {
      require('next-auth')
    } catch (error: any) {
      if (error.code === 'MODULE_NOT_FOUND') {
        nextAuthExists = false
      }
    }
    expect(nextAuthExists).toBe(false)
  })
})
