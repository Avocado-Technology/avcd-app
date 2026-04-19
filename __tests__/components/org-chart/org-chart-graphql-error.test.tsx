/**
 * Test: OrgChartGraphQLError Component
 * 
 * Following TDD - tests written first
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

describe('OrgChartGraphQLError Component', () => {
  const mockRefetch = jest.fn();
  const mockError = new Error('Test error');

  beforeEach(() => {
    mockRefetch.mockClear();
  });

  it('should display error message', async () => {
    const { OrgChartGraphQLError } = await import('@/components/org-chart/org-chart-graphql-error');
    
    render(<OrgChartGraphQLError error={mockError} refetch={mockRefetch} />);
    
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  it('should display retry button', async () => {
    const { OrgChartGraphQLError } = await import('@/components/org-chart/org-chart-graphql-error');
    
    render(<OrgChartGraphQLError error={mockError} refetch={mockRefetch} />);
    
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('should call refetch when retry button is clicked', async () => {
    const { OrgChartGraphQLError } = await import('@/components/org-chart/org-chart-graphql-error');
    
    render(<OrgChartGraphQLError error={mockError} refetch={mockRefetch} />);
    
    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);
    
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});
