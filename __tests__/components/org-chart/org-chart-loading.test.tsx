/**
 * Test: OrgChartLoading Component
 * 
 * Following TDD - tests written first
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

describe('OrgChartLoading Component', () => {
  it('should render loading skeleton', async () => {
    const { OrgChartLoading } = await import('@/components/org-chart/org-chart-loading');
    
    render(<OrgChartLoading />);
    
    // Should have some loading indicator
    const component = screen.getByTestId('org-chart-loading');
    expect(component).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', async () => {
    const { OrgChartLoading } = await import('@/components/org-chart/org-chart-loading');
    
    const { container } = render(<OrgChartLoading />);
    
    // ARIA attributes are now on the OrgChartSkeleton wrapper
    const statusElement = container.querySelector('[role="status"]');
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveAttribute('aria-live', 'polite');
    expect(statusElement).toHaveAttribute('aria-label', 'Loading organization chart');
  });
});
