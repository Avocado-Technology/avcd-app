/**
 * Apollo Client Configuration
 * 
 * Configures Apollo Client 4.x with:
 * - Authentication via Auth0 JWT tokens
 * - Error handling with proper error type checking
 * - Retry logic with exponential backoff and jitter
 * - App metadata for Apollo Studio
 * - Proper cache configuration
 */

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
} from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { CombinedGraphQLErrors, ServerError } from '@apollo/client/errors';

// RetryLink is in the core package
import { RetryLink } from '@apollo/client/link/retry';

function publicGraphqlUri(): string {
  const explicit = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.trim();
  if (explicit) return explicit;
  const base = process.env.NEXT_PUBLIC_AVCD_API_URL?.trim().replace(/\/+$/, '');
  if (base) return `${base}/graphql`;
  return 'http://localhost:8000/graphql';
}

const GRAPHQL_ENDPOINT = publicGraphqlUri();

/**
 * Create HTTP Link for GraphQL endpoint
 */
const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'same-origin',
});

/**
 * Create Auth Link to inject JWT token
 * Fetches token from /api/auth/token endpoint
 */
const authLink = setContext(async (_, { headers }) => {
  try {
    // Fetch access token from Auth0 session
    const response = await fetch('/api/auth/token');
    
    if (!response.ok) {
      console.warn('Failed to fetch access token');
      return { headers };
    }

    const { accessToken } = await response.json();

    return {
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    };
  } catch (error) {
    console.error('Error fetching access token:', error);
    return { headers };
  }
});

/**
 * Create Error Link for handling GraphQL and network errors
 * Uses Apollo 4.x error type checking with .is() methods
 */
const errorLink = new ErrorLink(({ error }) => {
  // Check if it's a GraphQL error
  if (CombinedGraphQLErrors.is(error)) {
    for (const err of error.errors) {
      const { message, locations, path, extensions } = err;
      
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );

      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED') {
        console.error('User is not authenticated, redirecting to login...');
        // Only redirect in browser environment
        if (typeof window !== 'undefined') {
          window.location.href = '/api/auth/login';
        }
        return;
      }

      // Handle authorization errors
      if (extensions?.code === 'FORBIDDEN') {
        console.error('User is not authorized to access this resource');
      }
    }
  } 
  // Check if it's a server error
  else if (ServerError.is(error)) {
    console.error(`[Network error]: Status ${error.statusCode}`, error);
  } 
  // Handle other error types
  else {
    console.error('[Error]:', error);
  }
});

/**
 * Create Retry Link for network failures
 * Uses exponential backoff with jitter to prevent thundering herd
 */
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 5000,
    jitter: true, // Randomize to prevent thundering herd
  },
  attempts: {
    max: 3,
    retryIf: (error) => {
      // Only retry network errors, not GraphQL errors
      // In Apollo Client 4.x, we check if the error is NOT a CombinedGraphQLErrors
      return !!error && !CombinedGraphQLErrors.is(error);
    },
  },
});

/**
 * Create InMemoryCache with complete type policies
 * 
 * Configured with:
 * - Proper entity normalization by ID
 * - Query field merge policies
 * - Cache key arguments for parameterized queries
 */
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Cache organizations separately
        organizations: {
          merge(_ignored, incoming) {
            return incoming; // Replace with fresh data
          },
        },
        // Cache stores per organization
        stores: {
          keyArgs: ["organizationId"], // Cache key includes orgId
          merge(_ignored, incoming) {
            return incoming;
          },
        },
        // Cache employees per organization
        employees: {
          keyArgs: ["organizationId"], // Cache key includes orgId
          merge(_ignored, incoming) {
            return incoming;
          },
        },
        financeAccounts: {
          keyArgs: ["organizationId"],
          merge(_ignored, incoming) {
            return incoming;
          },
        },
        financeTransactions: {
          keyArgs: ["organizationId"],
          merge(_ignored, incoming) {
            return incoming;
          },
        },
      },
    },
    // Entity type policies - normalize by ID
    Organization: {
      keyFields: ["id"],
    },
    Store: {
      keyFields: ["id"],
    },
    Employee: {
      keyFields: ["id"],
    },
    FinanceAccount: {
      keyFields: ["id"],
    },
    FinanceTransaction: {
      keyFields: ["id"],
    },
  },
});

/**
 * Create Apollo Client singleton
 * Configured with authentication, error handling, and retry logic
 */
export function createClientApolloClient() {
  return new ApolloClient({
    cache,
    link: from([retryLink, errorLink, authLink, httpLink]),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all', // Return both data and errors
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
}
