/**
 * OrgChartGraphQLError Component
 * 
 * Error state for organization chart with retry functionality
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ApolloError } from '@apollo/client';

interface OrgChartGraphQLErrorProps {
  error: ApolloError | Error;
  refetch: () => void;
}

export function OrgChartGraphQLError({
  error,
  refetch,
}: OrgChartGraphQLErrorProps) {
  // Check for specific error codes
  // Safe check for ApolloError
  const isApolloError = error && 'graphQLErrors' in error;
  const isAuthError = 
    isApolloError &&
    (error as ApolloError).graphQLErrors.some(
      (err) =>
        err.extensions?.code === 'UNAUTHENTICATED' ||
        err.extensions?.code === 'FORBIDDEN'
    );

  const errorMessage = isAuthError
    ? 'You are not authorized to view this data. Please log in again.'
    : 'Failed to load organization data. Please try again.';

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center min-h-[400px] p-8"
    >
      <div className="max-w-md text-center space-y-4">
        <div className="text-red-600 text-lg font-semibold">
          Error Loading Data
        </div>
        
        <p className="text-neutral-600">{errorMessage}</p>
        
        {!isAuthError && (
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        )}
        
        {isAuthError && (
          <Link
            href="/api/auth/login"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Log In
          </Link>
        )}
      </div>
    </div>
  );
}
