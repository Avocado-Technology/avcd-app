# Org Chart Skeleton - Manual Testing Guide

This document provides a checklist for manual testing of the new org chart skeleton loader.

## Automated Tests Status

✅ **All automated tests passing**: 510/510 tests pass
- Unit tests for skeleton nodes (14 tests)
- Integration tests for org chart states (12 tests)
- No lint errors in skeleton files

## Manual Testing Checklist

### 1. Visual Appearance Test

**Goal**: Verify skeleton looks good and matches design

**Steps**:
1. Navigate to the org chart page (`/org`)
2. Refresh the page to see the loading state
3. Verify the skeleton structure:
   - ✅ 1 organization node at top (280×80px)
   - ✅ 2 store nodes in middle row (220×70px each)
   - ✅ 4 employee nodes at bottom (180×60px each, 2 per store)
4. Check visual elements:
   - ✅ Nodes have rounded corners
   - ✅ Nodes have subtle borders
   - ✅ Icon/avatar placeholders are visible
   - ✅ Text bar placeholders are visible
   - ✅ Pulse animation is active
   - ✅ Spacing looks hierarchical

**Expected Result**: Skeleton should be recognizable as an org chart structure

---

### 2. Dark Mode Test

**Goal**: Verify skeleton colors work in dark mode

**Steps**:
1. Toggle to dark mode (if theme switcher available)
2. Navigate to org chart page
3. Observe skeleton colors:
   - ✅ Node backgrounds adapt to dark theme
   - ✅ Borders are visible but subtle
   - ✅ Skeleton elements (`--g300`) have adequate contrast
   - ✅ No jarring color differences

**Color References**:
- Light mode: `--g300` = #d4d4d4
- Dark mode: `--g300` = #525252

**Expected Result**: Skeleton should have good contrast in both themes

---

### 3. Network Throttling Test

**Goal**: Verify skeleton is visible long enough to be useful

**Steps**:
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Set throttling to "Slow 3G"
4. Refresh org chart page
5. Observe:
   - ✅ Skeleton appears immediately
   - ✅ Skeleton is visible for 1-3 seconds
   - ✅ Transition to real data is smooth
   - ✅ No layout shift when data loads

**Expected Result**: Skeleton should improve perceived performance

---

### 4. Reduced Motion Test

**Goal**: Verify accessibility for users with motion sensitivity

**Steps**:

**macOS**:
1. Go to System Settings → Accessibility → Display
2. Enable "Reduce motion"
3. Refresh org chart page
4. Verify:
   - ✅ Pulse animation is reduced/disabled
   - ✅ Skeleton still visible and functional

**Windows**:
1. Settings → Ease of Access → Display
2. Turn on "Show animations in Windows"
3. Refresh org chart page

**Expected Result**: Animation should respect user's preference

---

### 5. Responsive Test

**Goal**: Verify skeleton works on different screen sizes

**Steps**:
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
3. Test viewports:

**Desktop (1920×1080)**:
- ✅ All 7 nodes visible
- ✅ Centered horizontally
- ✅ Good spacing

**Tablet (768×1024)**:
- ✅ All nodes visible
- ✅ May need horizontal scroll
- ✅ Layout intact

**Mobile (375×667)**:
- ✅ Horizontal scroll works
- ✅ Nodes maintain dimensions
- ✅ No vertical cutoff

**Expected Result**: Skeleton should work on all screen sizes

---

### 6. Bundle Size Check

**Goal**: Verify skeleton doesn't bloat the bundle

**Steps**:
1. Run build: `npm run build`
2. Check build output for bundle sizes
3. Compare before/after if possible
4. Verify:
   - ✅ Skeleton components add <5KB to bundle
   - ✅ No unexpected dependencies

**Expected Result**: Minimal impact on bundle size

---

### 7. Accessibility Test

**Goal**: Verify screen reader compatibility

**Steps**:

**macOS VoiceOver**:
1. Enable VoiceOver (Cmd+F5)
2. Navigate to org chart page
3. Listen for:
   - ✅ "Loading organization chart" announcement
   - ✅ Skeleton elements are hidden from screen reader
   - ✅ No focus trap

**Windows NVDA** (if available):
1. Start NVDA
2. Navigate to org chart page
3. Verify similar behavior

**Expected Result**: Screen readers should announce loading state correctly

---

### 8. Integration Test

**Goal**: Verify skeleton integrates with real loading flow

**Steps**:
1. Clear browser cache
2. Navigate to org chart page
3. Observe full loading sequence:
   - ✅ Skeleton appears immediately
   - ✅ GraphQL query executes
   - ✅ Real data replaces skeleton
   - ✅ No error states
   - ✅ Smooth transition

**Expected Result**: Complete loading flow works end-to-end

---

## Known Limitations

1. **Fixed node widths**: On very small screens (<400px), nodes may overflow. This is acceptable since the layout allows horizontal scrolling.
2. **No connecting lines**: V1 deliberately omits visual connectors. Can be added in V2 if needed.
3. **Static structure**: Skeleton always shows 1-2-4 pattern, regardless of actual data size.

## Success Criteria

The skeleton implementation is successful if:
- ✅ All automated tests pass (510/510)
- ✅ Skeleton is visually recognizable as an org chart
- ✅ Dark mode colors have adequate contrast
- ✅ Animation respects `prefers-reduced-motion`
- ✅ Responsive on mobile/tablet/desktop
- ✅ Bundle size impact is <5KB
- ✅ Screen readers announce loading state
- ✅ Integration with real loading flow is smooth

## Next Steps (V2 - Future Enhancements)

If user feedback indicates need for improvements:
1. Add connecting lines between hierarchy levels
2. Expand to 1-3-6 structure (more nodes)
3. Add staggered animation (different pulse timing per level)
4. Implement progressive loading (skeleton → partial data → full data)

## Files Created

- `components/org-chart/skeleton/skeleton-nodes.tsx` - Node components
- `components/org-chart/skeleton/skeleton-layout.tsx` - Grid layout
- `components/org-chart/skeleton/index.ts` - Barrel exports
- `__tests__/components/org-chart/skeleton/skeleton-nodes.test.tsx` - Unit tests

## Files Modified

- `components/org-chart/org-chart-skeleton.tsx` - Replaced with new wrapper
- `components/org-chart/org-chart-loading.tsx` - Updated to use new skeleton
- `components/org-chart/animated-org-chart.tsx` - Removed ReactFlow loading fallback to prevent double skeleton
- `components/org-chart/react-flow-canvas.tsx` - Removed ReactFlow loading fallback to prevent double skeleton
- `__tests__/components/org-chart/org-chart-states.test.tsx` - Updated tests
- `__tests__/components/org-chart/org-chart-loading.test.tsx` - Fixed accessibility test

## Important Fix: Double Skeleton Issue

**Issue**: Initially, two skeletons were displayed:
1. The hierarchical org chart skeleton (data loading)
2. A generic PageSkeleton (ReactFlow library loading)

**Root Cause**: The ReactFlow dynamic import had a `loading` prop that showed PageSkeleton while the library loaded. This created a jarring experience where users saw the hierarchical skeleton disappear, then briefly see a generic skeleton.

**Fix**: Removed the `loading` prop from ReactFlow dynamic imports in both:
- `animated-org-chart.tsx`
- `react-flow-canvas.tsx`

**Result**: Now only the hierarchical skeleton shows during data loading. ReactFlow loads fast enough that no additional loading indicator is needed.

---

**Implementation completed**: All code is written and tested. Manual verification recommended before considering complete.
