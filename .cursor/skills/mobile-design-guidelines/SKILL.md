---
name: mobile-design-guidelines
description: Comprehensive mobile app design and usability guidelines based on 2026 research, Apple HIG, Material Design 3, WCAG 2.2, and Steven Hoober's thumb zone studies. Use when designing mobile interfaces, positioning buttons, creating navigation patterns, optimizing touch targets, or implementing any mobile UI component. Triggers on "mobile design", "button placement", "touch target", "thumb zone", "mobile navigation", "mobile accessibility", "mobile UX", or any request to build or review mobile interfaces.
---

# Mobile Design & Usability Guidelines (2026)

Research-backed mobile design patterns and usability standards from Apple HIG, Material Design 3, WCAG 2.2, and Steven Hoober's foundational thumb zone studies.

## Critical Success Metrics

- **74%** of users return to apps with strong mobile UX
- **67-75%** of interactions happen one-handed
- **Every 100ms of added load time costs 1.1% conversion**
- **53%** of users abandon if load time exceeds 3 seconds
- Progressive onboarding increases retention by **50%** and engagement by **90%**

## The Three Reachability Zones

Based on Steven Hoober's research of 1,300+ mobile users:

### Natural Zone (Bottom 30% of screen)
**PRIMARY ACTIONS BELONG HERE**
- Easy, comfortable thumb reach
- Place: Navigation tabs, "Buy Now", "Submit", "Continue" buttons
- Touch targets can be smaller (7mm minimum) due to high precision
- **Real-world impact:** One retailer improved checkout completion from 18% to 42% by moving buttons here

### Stretch Zone (Middle 40% of screen)
- Requires thumb extension
- Place: Secondary actions, scrollable content, form fields
- Touch targets need 44-48px minimum

### No-Go Zone (Top 30% of screen)
- Hard to reach without grip adjustment
- **NEVER place interactive elements here**
- Use only for: Headers, titles, status info, branding

## Button Placement Rules

### Always Bottom
✅ **Navigation bars** - Bottom tab bar with 3-5 sections
✅ **Toolbars** - Contextual actions (share, edit, delete)
✅ **Floating Action Buttons (FAB)** - Bottom-right or center for primary creation
✅ **Form submissions** - Full-width or centered at bottom
✅ **Frequently-used actions** - Any repeated interaction

### Follow Content Flow
✅ **Decision dialogs** - Place "Confirm/Accept" after message content (78% of users expect this)
✅ **Alerts** - Follow natural reading flow
✅ **Confirmation modals** - Visual hierarchy matters for deliberate choices

### Never Top
❌ **Primary interactive elements** - Avoid top 30% entirely
❌ **Destructive actions** - Never in common tap areas
❌ **Frequently-used buttons** - Don't make users reach

## Touch Target Standards

### Minimum Sizes (WCAG 2.2 + Platform Guidelines)
- **Absolute minimum:** 24×24 CSS pixels (WCAG 2.2)
- **Apple/Google recommendation:** 44-48 points/dp
- **Primary action buttons:** 56-64px height
- **Standard buttons:** 48-52px height
- **Spacing between elements:** 8px minimum
- **Hard-to-reach areas:** Up to 12mm targets (reduced accuracy)

### Safe Areas
- **iOS bottom safe area:** Account for 34px on iPhone X and later
- **Avoid edges:** Corners are harder to hit accurately

## iOS-Specific Patterns (2026)

### Latest from Human Interface Guidelines

**Bottom Toolbars (Standard Pattern):**
- Appears at bottom of screen for contextual actions
- Icons work best for 4+ buttons; text for 3 or fewer
- Hides when keyboard appears or unlikely to be needed
- Use for current context: create, delete, annotate, share
- Never mix toolbars with tab bars in same view

**Liquid Glass Design (iOS 26):**
- Central to navigation and toolbar aesthetics
- Applied consistently across system apps

**Typography:**
- SF Symbols 7 with Draw animations and gradient rendering
- Emphasized weights in Dynamic Type specifications

### Implementation Resources
- iOS/iPadOS 26 UI Kit for Sketch
- visionOS and watchOS design kits for Figma
- Device specs for iPhone 17 models

## Android-Specific Patterns (2026)

### Material Design 3 Expressive

**Bottom App Bar Layouts:**

1. **Centered FAB** - Home screens with navigation + prominent action
   - Minimum 1, maximum 2 additional actions on opposite side

2. **End FAB** - Secondary screens requiring 3-4 actions
   - FAB positioned at end, actions on opposite side

3. **No FAB** - When FAB not needed
   - Navigation icon + up to 4 actions on opposing edge

**Design Principles:**
- Ergonomic: Easy to reach from handheld position
- Best for 2-5 actions
- Mobile devices only (not tablets/desktop)

**M3 Expressive Components:**
- Toolbars (flexible component for frequent actions)
- Split buttons (button + related actions in connected menu)
- Button groups (shape-shifting buttons that react to each other)
- 35 new shapes with built-in shape morph motion
- Updated progress indicators

### Implementation
- Material Theme Builder for custom color schemes
- Dynamic color and Material You personalization
- Jetpack Compose with M3 theming

## Typography & Readability

- **Body text minimum:** 16px
- **Line height ratio:** 1.4-1.6
- **Maximum typefaces:** 2
- **Type sizes:** 3 only (large headlines, medium body, small captions)
- **High contrast** for varying lighting conditions

## Color & Accessibility (WCAG 2.2)

### Contrast Requirements
- **Normal text:** 4.5:1 minimum ratio
- **Large text:** 3:1 minimum ratio
- **UI components:** 3:1 minimum ratio
- Apply accent colors to **signal interactivity**, not decoration

### 2026 Regulatory Deadline
- U.S. HHS-funded organizations must meet WCAG 2.1 AA standards
- W3C published "Guidance on Applying WCAG 2.2 to Mobile Applications" (May 2025)
- Test on real devices with assistive technologies

### Dark Mode
- Dark-first design now expected standard
- Not optional for modern apps

## Navigation Patterns That Work

### Bottom Tab Bar (Primary Pattern)
- 3-5 main sections
- **Icons + labels outperform icons alone by 50%** in discoverability
- Standard for main app navigation

### Other Patterns by Use Case
- **Hamburger menus:** Extensive options (but 54% less discoverable than tabs)
- **Gesture navigation:** Compound gestures with feedback layers
- **Search-first:** When content discovery is primary function

## Form Optimization

- **Each field adds 4-7% abandonment** - minimize required fields
- Use correct input types to reduce input time by **20-30%**
- Place submit button at bottom, full-width or centered
- Provide immediate visual feedback within **100 milliseconds**

## Loading & Feedback Patterns

### Visual Feedback Requirements
- **100ms maximum** for interaction acknowledgment
- Use skeleton screens for loading states
- Progressive loading for content
- Optimistic updates (show result before server confirmation)

### Loading State Strategies
- Skeleton screens (preferred)
- Progressive disclosure
- Graceful degradation on slow connections

## Performance Standards (2026)

### Startup Time
- **Cold start:** < 2 seconds
- **Warm start:** < 500ms
- **TTID (P90) targets:**
  - Social/media: 800ms-1.3s
  - E-commerce: 900ms-1.4s
  - Enterprise: up to 1.8s

### Frame Rate
- **Target:** Consistent 60+ FPS (16.67ms per frame)
- **High-end devices:** 120 FPS (8.33ms per frame)

### Memory & Size
- **iOS typical usage:** < 150MB
- **APK/IPA size:** < 30MB initial download
- **Critical path budget:** 150KB on 2G connections

### Interaction Latency
- **Perceived latency:** Sub-10ms expected
- **API latency:** Sub-10ms for enterprise apps

### Optimization Strategies

**Startup:**
- Defer non-essential initialization
- Lazy load components
- Avoid heavy tasks on main thread

**Network:**
- Edge computing (servers closer to users)
- Cache accessed data
- Reduce API request frequency
- Compress transmitted data

**Memory:**
- Use weak references
- Prevent circular references
- Clear listeners and close resources

**UI/Rendering:**
- Efficient list rendering (ListView.builder, FlatList)
- Minimize unnecessary redraws
- Optimize animations
- Keep main UI thread free

**2026-Specific:**
- Leverage on-device AI and NPUs
- Event-driven execution vs. continuous polling
- Model quantization for on-device inference

## 2026 UX Patterns & Trends

### AI-Native Adaptive Interfaces
- Layouts restructure based on user behavior
- **Key principle:** Invisible adaptation - users shouldn't notice the shift
- Examples: Spotify (podcasts vs. playlists), Google Maps (context-based modes)

### Gesture-Based Navigation
- Compound gestures with feedback layers
- Primary interaction model across platforms
- Beyond simple swipe and tap

### Passwordless Authentication
- Now expected standard, not experimental
- Biometric authentication, magic links, passkeys

### Progressive Onboarding
- Show **core value within 30 seconds** before registration
- Can increase retention by 50%, engagement by 90%

## Implementation Checklist

### Before Starting Any Mobile Component

- [ ] **Touch targets:** All interactive elements ≥ 44×44px
- [ ] **Spacing:** 8px minimum between interactive elements
- [ ] **Primary actions:** Positioned in bottom 40% of screen
- [ ] **Top 30% rule:** No interactive elements in top 30%
- [ ] **Color contrast:** 4.5:1 for text, 3:1 for large text/UI
- [ ] **Typography:** Body text ≥ 16px, line height 1.4-1.6
- [ ] **Navigation:** Bottom tab bar with icons + labels
- [ ] **Performance:** Target < 2s cold start, 60+ FPS
- [ ] **Feedback:** < 100ms visual response to interactions
- [ ] **Platform patterns:** iOS bottom toolbars or Android bottom app bar

### When Positioning Buttons

**Ask yourself:**
1. Is this a primary, frequently-used action? → **Bottom**
2. Is this a navigation element? → **Bottom tab bar**
3. Is this a form submission? → **Bottom, full-width**
4. Is this a creation action? → **FAB bottom-right/center**
5. Is this a decision dialog? → **Follow content, visual hierarchy**
6. Is this destructive? → **Never in common tap areas**
7. Is this in the top 30%? → **❌ Move it lower**

### When Designing Navigation

**Bottom tab bar when:**
- 3-5 main sections
- Frequent context switching
- Need maximum discoverability

**Bottom app bar when:**
- 2-5 contextual actions
- FAB needed for primary creation
- Mobile-only (not tablet)

**Other patterns when:**
- More than 5 sections (consider hamburger + search)
- Gesture-first interface (swipe-based navigation)

## Common Anti-Patterns to Avoid

❌ **Top-only primary buttons** - Users can't reach
❌ **Small touch targets** - < 44px causes errors
❌ **No spacing** - Accidental taps between buttons
❌ **Icons without labels** - 50% worse discoverability
❌ **Destructive actions in common areas** - Accidental deletion
❌ **No visual feedback** - Users unsure if action registered
❌ **Slow cold start** - > 2s loses 53% of users
❌ **No dark mode** - Now expected standard
❌ **Poor contrast** - Fails accessibility requirements
❌ **Tab bar + toolbar together** - Conflicting patterns

## Platform-Specific Quick Reference

### iOS Bottom Patterns
- Tab bar navigation (standard)
- Bottom toolbar for contextual actions
- Modal sheets with bottom buttons
- Action sheets slide from bottom

### Android Bottom Patterns
- Bottom navigation bar (3-5 items)
- Bottom app bar with FAB
- Bottom sheets for actions
- Snackbars for feedback

## Additional Resources

- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines
- Material Design 3: https://m3.material.io/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Steven Hoober's Research: Touch Design for Mobile Interfaces (2022)

## When to Apply This Skill

Use this skill whenever:
- Designing new mobile interfaces or components
- Positioning buttons, navigation, or interactive elements
- Reviewing mobile UI/UX implementations
- Optimizing for one-handed use
- Ensuring accessibility compliance
- Implementing platform-specific patterns (iOS/Android)
- Making decisions about layout, typography, or touch targets
- Performance tuning mobile applications

Always prioritize: **thumb reachability > visual preference** for functional elements.
