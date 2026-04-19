/**
 * Auth0 Token API Route
 * 
 * Extracts and returns the access token from Auth0 session
 * Used by Apollo Client's auth link to inject JWT tokens
 */

import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/auth/token
 * 
 * Returns the access token from the current Auth0 session
 * 
 * @returns {accessToken: string} - JWT access token
 * @returns 401 if not authenticated or token missing
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      accessToken: session.accessToken,
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}
