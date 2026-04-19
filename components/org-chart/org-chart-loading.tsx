/**
 * OrgChartLoading Component
 *
 * Loading state for organization chart with proper ARIA attributes
 * Uses hierarchical skeleton layout showing org structure
 */

'use client';

import React from 'react';
import { OrgChartSkeleton } from './org-chart-skeleton';

export function OrgChartLoading() {
  return (
    <div data-testid="org-chart-loading">
      <OrgChartSkeleton />
    </div>
  );
}
