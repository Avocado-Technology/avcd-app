/**
 * Test: Auth0 Token API Route
 * 
 * Following TDD - this test is written first and will fail until implementation
 */

// Mock @auth0/nextjs-auth0 before any imports
jest.mock('@auth0/nextjs-auth0', () => ({
  getSession: jest.fn(),
}));

// Mock next/server to avoid Request/Response issues in test environment
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, init) => ({
      status: init?.status || 200,
      json: async () => data,
    })),
  },
}));

import { getSession } from '@auth0/nextjs-auth0';

// Type for the GET handler
type GetHandler = (request: Request) => Promise<Response>;

describe('Token API Route', () => {
  let GET: GetHandler;

  beforeEach(async () => {
    jest.clearAllMocks();
    // Dynamically import the route after mocks are set up
    const routeModule = await import('@/app/api/auth/token/route');
    GET = routeModule.GET;
  });

  describe('GET /api/auth/token', () => {
    it('should return access token when user is authenticated', async () => {
      const mockAccessToken = 'test-access-token-123';
      
      (getSession as jest.Mock).mockResolvedValue({
        user: { sub: 'auth0|123' },
        accessToken: mockAccessToken,
      });

      const request = {} as Request; // Mock request object
      const response = await GET(request);

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toEqual({ accessToken: mockAccessToken });
    });

    it('should return 401 when user is not authenticated', async () => {
      (getSession as jest.Mock).mockResolvedValue(null);

      const request = {} as Request; // Mock request object
      const response = await GET(request);

      expect(response.status).toBe(401);
      
      const data = await response.json();
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('should return 401 when access token is missing', async () => {
      (getSession as jest.Mock).mockResolvedValue({
        user: { sub: 'auth0|123' },
        // No accessToken
      });

      const request = {} as Request; // Mock request object
      const response = await GET(request);

      expect(response.status).toBe(401);
      
      const data = await response.json();
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('should handle errors gracefully', async () => {
      (getSession as jest.Mock).mockRejectedValue(new Error('Session error'));

      const request = {} as Request; // Mock request object
      const response = await GET(request);

      expect(response.status).toBe(401);
      
      const data = await response.json();
      expect(data).toEqual({ error: 'Unauthorized' });
    });
  });
});
