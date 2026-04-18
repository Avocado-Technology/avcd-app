/**
 * Authentication Routes Tests
 * 
 * Verifies that only Auth0 routes exist and NextAuth routes are removed.
 */

import { existsSync } from 'fs'
import { join } from 'path'

describe('Auth Route Files', () => {
  const appDir = join(process.cwd(), 'app')

  it('should have Auth0 route handler at /api/auth/[auth0]', () => {
    const auth0RoutePath = join(appDir, 'api', 'auth', '[auth0]', 'route.ts')
    expect(existsSync(auth0RoutePath)).toBe(true)
  })

  it('should NOT have NextAuth route handler at /api/auth/[...nextauth]', () => {
    const nextAuthRoutePath = join(appDir, 'api', 'auth', '[...nextauth]', 'route.ts')
    expect(existsSync(nextAuthRoutePath)).toBe(false)
  })

  it('should NOT have auth.ts file in root', () => {
    const authFilePath = join(process.cwd(), 'auth.ts')
    expect(existsSync(authFilePath)).toBe(false)
  })

  it('should NOT have NextAuth logout route', () => {
    const logoutRoutePath = join(appDir, 'logout', 'google', 'route.ts')
    expect(existsSync(logoutRoutePath)).toBe(false)
  })
})
