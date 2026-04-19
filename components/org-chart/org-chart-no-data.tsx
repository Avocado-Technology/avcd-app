/**
 * OrgChartNoData Component
 * 
 * Empty state for organization chart when no data exists
 */

'use client';

import React from 'react';
import { OrgChartEmpty } from './org-chart-empty';

export function OrgChartNoData() {
  return (
    <div role="status" aria-label="No organizations found">
      <OrgChartEmpty />
      <div className="text-center mt-4 text-neutral-600">
        <p>No organizations found</p>
        <p className="text-sm mt-2">
          Create your first organization to get started
        </p>
      </div>
    </div>
  );
}
