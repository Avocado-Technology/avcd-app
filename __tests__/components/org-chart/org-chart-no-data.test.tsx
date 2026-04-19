/**
 * Test: OrgChartNoData Component
 * 
 * Following TDD - tests written first
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

describe('OrgChartNoData Component', () => {
  it('should render empty state message', async () => {
    const { OrgChartNoData } = await import('@/components/org-chart/org-chart-no-data');
    
    render(<OrgChartNoData />);
    
    expect(screen.getByText(/no organizations/i)).toBeInTheDocument();
  });

  it('should have proper accessibility', async () => {
    const { OrgChartNoData } = await import('@/components/org-chart/org-chart-no-data');
    
    const { container } = render(<OrgChartNoData />);
    
    expect(container.firstChild).toHaveAttribute('role', 'status');
  });
});
