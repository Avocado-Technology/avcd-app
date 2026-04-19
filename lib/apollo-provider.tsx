/**
 * Apollo Provider Wrapper
 * 
 * Client-side component that wraps the application with ApolloProvider
 * Uses singleton pattern to ensure single client instance
 */

'use client';

import { ApolloProvider as BaseApolloProvider } from '@apollo/client/react';
import { createClientApolloClient } from './apollo-client';
import { ReactNode, useMemo } from 'react';

interface ApolloProviderProps {
  children: ReactNode;
}

/**
 * Client-side Apollo Provider wrapper
 * 
 * Usage:
 * ```tsx
 * <ApolloProvider>
 *   <YourApp />
 * </ApolloProvider>
 * ```
 */
export function ApolloProvider({ children }: ApolloProviderProps) {
  // Create client with singleton pattern using useMemo
  const client = useMemo(() => createClientApolloClient(), []);

  return (
    <BaseApolloProvider client={client}>
      {children}
    </BaseApolloProvider>
  );
}
