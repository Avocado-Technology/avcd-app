/**
 * OrgChartLoading Component
 * 
 * Loading state for organization chart
 */

'use client';

import React from 'react';
import { OrgChartSkeleton } from './org-chart-skeleton';

export function OrgChartLoading() {
  return (
    <div
      data-testid="org-chart-loading"
      role="status"
      aria-live="polite"
      aria-label="Loading organization chart"
    >
      <OrgChartSkeleton />
    </div>
  );
}
