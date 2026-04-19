/**
 * OrgChartGraphQLError Component
 * 
 * Error state for organization chart with retry functionality
 */

'use client';

import React from 'react';
import Link from 'next/link';

interface GraphQLErrorExtension {
  code?: string;
  [key: string]: unknown;
}

interface GraphQLError {
  message: string;
  extensions?: GraphQLErrorExtension;
}

interface ErrorWithGraphQL extends Error {
  errors?: GraphQLError[];
}

interface OrgChartGraphQLErrorProps {
  error: ErrorWithGraphQL | Error;
  refetch: () => void;
}

export function OrgChartGraphQLError({
  error,
  refetch,
}: OrgChartGraphQLErrorProps) {
  // Check for specific error codes
  // Safe check for GraphQL error
  const isGraphQLError = error && 'errors' in error;
  const isAuthError = 
    isGraphQLError &&
    (error as ErrorWithGraphQL).errors?.some(
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
        <div className="text-[var(--red)] text-lg font-semibold">
          Error Loading Data
        </div>
        
        <p className="text-[var(--g500)]">{errorMessage}</p>
        
        {!isAuthError && (
          <button
            onClick={refetch}
            className="px-4 py-2 bg-gray-900 text-[var(--bg)] rounded-md hover:bg-gray-700 transition-colors"
          >
            Retry
          </button>
        )}
        
        {isAuthError && (
          <Link
            href="/api/auth/login"
            className="inline-block px-4 py-2 bg-gray-900 text-[var(--bg)] rounded-md hover:bg-gray-700 transition-colors"
          >
            Log In
          </Link>
        )}
      </div>
    </div>
  );
}
