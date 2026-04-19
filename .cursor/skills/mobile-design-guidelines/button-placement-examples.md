# Button Placement Examples & Patterns

Real-world examples of proper button placement following thumb zone research and platform guidelines.

## Navigation Examples

### Bottom Tab Bar (Standard Pattern)

**Good Example:**
```tsx
// Bottom navigation with icons + labels
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
  <div className="flex justify-around items-center h-16">
    <button className="flex flex-col items-center min-w-[64px] min-h-[48px]">
      <HomeIcon className="w-6 h-6" />
      <span className="text-xs mt-1">Home</span>
    </button>
    <button className="flex flex-col items-center min-w-[64px] min-h-[48px]">
      <SearchIcon className="w-6 h-6" />
      <span className="text-xs mt-1">Search</span>
    </button>
    <button className="flex flex-col items-center min-w-[64px] min-h-[48px]">
      <ProfileIcon className="w-6 h-6" />
      <span className="text-xs mt-1">Profile</span>
    </button>
  </div>
</nav>
```

**Bad Example:**
```tsx
// ❌ Icons without labels - 50% worse discoverability
<nav className="fixed bottom-0">
  <button><HomeIcon /></button>
  <button><SearchIcon /></button>
</nav>

// ❌ Navigation at top - hard to reach
<nav className="fixed top-0">
  <button>Home</button>
  <button>Search</button>
</nav>
```

## Form Submission Examples

### Good: Bottom Full-Width Button

```tsx
<form className="flex flex-col h-full">
  {/* Form fields in scrollable area */}
  <div className="flex-1 overflow-y-auto p-4">
    <input type="text" className="w-full h-12" />
    <input type="email" className="w-full h-12" />
  </div>
  
  {/* Submit button at bottom - easy to reach */}
  <div className="p-4 border-t bg-white">
    <button 
      type="submit"
      className="w-full h-14 bg-green-600 text-white rounded-lg"
    >
      Continue
    </button>
  </div>
</form>
```

### Good: Sticky Bottom Button

```tsx
// Button stays at bottom even during scroll
<div className="pb-20"> {/* Add padding for sticky button */}
  <form className="p-4">
    {/* Long form content */}
  </form>
  
  <button className="fixed bottom-4 left-4 right-4 h-14 bg-green-600">
    Submit Order
  </button>
</div>
```

### Bad: Top-Only Button

```tsx
// ❌ Primary action at top - users can't reach
<form>
  <button className="mb-4">Submit</button>
  
  <input type="text" />
  <input type="email" />
  {/* User has to scroll up to submit */}
</form>
```

## iOS Bottom Toolbar Example

```tsx
// iOS-style bottom toolbar with contextual actions
<div className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-t flex items-center justify-around">
  <button className="flex flex-col items-center min-w-[64px]">
    <ShareIcon className="w-6 h-6" />
    <span className="text-xs mt-1">Share</span>
  </button>
  <button className="flex flex-col items-center min-w-[64px]">
    <EditIcon className="w-6 h-6" />
    <span className="text-xs mt-1">Edit</span>
  </button>
  <button className="flex flex-col items-center min-w-[64px]">
    <DeleteIcon className="w-6 h-6 text-red-600" />
    <span className="text-xs mt-1">Delete</span>
  </button>
</div>
```

## Android Bottom App Bar with FAB

### Centered FAB Pattern

```tsx
// Material Design 3 - Centered FAB
<div className="fixed bottom-0 left-0 right-0">
  <div className="relative h-16 bg-surface flex items-center">
    {/* Navigation icon on left */}
    <button className="ml-4 w-12 h-12">
      <MenuIcon />
    </button>
    
    {/* Centered FAB overlapping the bar */}
    <button className="absolute left-1/2 -translate-x-1/2 -top-7 w-14 h-14 rounded-full bg-primary shadow-lg">
      <AddIcon className="text-white" />
    </button>
    
    {/* Actions on right */}
    <div className="ml-auto mr-4 flex gap-2">
      <button className="w-12 h-12"><SearchIcon /></button>
      <button className="w-12 h-12"><MoreIcon /></button>
    </div>
  </div>
</div>
```

### End FAB Pattern

```tsx
// Material Design 3 - End FAB
<div className="fixed bottom-0 left-0 right-0">
  <div className="relative h-16 bg-surface flex items-center">
    {/* Actions on left */}
    <div className="ml-4 flex gap-2">
      <button className="w-12 h-12"><MenuIcon /></button>
      <button className="w-12 h-12"><SearchIcon /></button>
      <button className="w-12 h-12"><FilterIcon /></button>
    </div>
    
    {/* End FAB */}
    <button className="absolute right-4 -top-7 w-14 h-14 rounded-full bg-primary shadow-lg">
      <AddIcon className="text-white" />
    </button>
  </div>
</div>
```

## Decision Dialog Examples

### Good: Follow Content Flow

```tsx
// Dialog with buttons following content (visual hierarchy)
<div className="fixed inset-0 flex items-center justify-center bg-black/50">
  <div className="bg-white rounded-lg p-6 max-w-sm">
    <h2 className="text-xl font-semibold mb-2">Delete Account?</h2>
    <p className="text-gray-600 mb-6">
      This action cannot be undone. All your data will be permanently deleted.
    </p>
    
    {/* Buttons follow content for deliberate choice */}
    <div className="flex gap-3">
      <button className="flex-1 h-12 bg-gray-200 rounded-lg">
        Cancel
      </button>
      <button className="flex-1 h-12 bg-red-600 text-white rounded-lg">
        Delete
      </button>
    </div>
  </div>
</div>
```

### Alternative: Bottom Sheet Pattern

```tsx
// Bottom sheet with buttons at bottom (thumb-friendly)
<div className="fixed inset-0 bg-black/50">
  <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl">
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">Confirm Purchase</h2>
      <p className="text-gray-600">
        You're about to purchase Premium Plan for $9.99/month
      </p>
    </div>
    
    {/* Buttons at bottom of sheet */}
    <div className="p-4 border-t flex flex-col gap-3">
      <button className="w-full h-14 bg-green-600 text-white rounded-lg">
        Confirm Purchase
      </button>
      <button className="w-full h-12 text-gray-600">
        Cancel
      </button>
    </div>
  </div>
</div>
```

## Floating Action Button (FAB) Examples

### Good: Bottom-Right Positioning

```tsx
// Standard FAB position - bottom-right, easy to reach with thumb
<button className="fixed bottom-20 right-6 w-14 h-14 rounded-full bg-green-600 shadow-lg flex items-center justify-center">
  <AddIcon className="text-white w-6 h-6" />
</button>
```

### Extended FAB with Text

```tsx
// Extended FAB for important actions
<button className="fixed bottom-20 right-6 h-14 px-6 rounded-full bg-green-600 shadow-lg flex items-center gap-2">
  <AddIcon className="text-white w-6 h-6" />
  <span className="text-white font-medium">New Post</span>
</button>
```

### Bad: Top-Right FAB

```tsx
// ❌ Top-right - hard to reach, especially one-handed
<button className="fixed top-20 right-6 w-14 h-14 rounded-full bg-green-600">
  <AddIcon className="text-white" />
</button>
```

## Multi-Button Layouts

### Good: Stacked Buttons at Bottom

```tsx
// Multiple actions stacked at bottom
<div className="fixed bottom-4 left-4 right-4 flex flex-col gap-3">
  <button className="w-full h-14 bg-green-600 text-white rounded-lg">
    Primary Action
  </button>
  <button className="w-full h-12 border-2 border-gray-300 rounded-lg">
    Secondary Action
  </button>
</div>
```

### Good: Side-by-Side at Bottom

```tsx
// Two actions side-by-side at bottom (equal priority)
<div className="fixed bottom-4 left-4 right-4 flex gap-3">
  <button className="flex-1 h-14 bg-gray-200 rounded-lg">
    Cancel
  </button>
  <button className="flex-1 h-14 bg-green-600 text-white rounded-lg">
    Confirm
  </button>
</div>
```

## Touch Target Sizing Examples

### Good: Proper Sizing and Spacing

```tsx
// All targets meet 44x44px minimum with 8px spacing
<div className="flex gap-2"> {/* 8px gap */}
  <button className="min-w-[44px] min-h-[44px] px-4">Action 1</button>
  <button className="min-w-[44px] min-h-[44px] px-4">Action 2</button>
  <button className="min-w-[44px] min-h-[44px] px-4">Action 3</button>
</div>
```

### Bad: Too Small, Too Close

```tsx
// ❌ Targets too small and too close together
<div className="flex gap-1"> {/* Only 4px gap */}
  <button className="w-8 h-8">1</button> {/* Only 32px */}
  <button className="w-8 h-8">2</button>
  <button className="w-8 h-8">3</button>
</div>
```

## Responsive Safe Area Examples

### iOS Safe Area Handling

```tsx
// Account for iOS bottom safe area (34px on iPhone X+)
<div className="fixed bottom-0 left-0 right-0 pb-safe">
  <div className="p-4 bg-white">
    <button className="w-full h-14 bg-green-600 text-white rounded-lg">
      Continue
    </button>
  </div>
</div>

// Tailwind config for safe area
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      padding: {
        'safe': 'env(safe-area-inset-bottom)',
      },
    },
  },
}
```

### Alternative: Manual Safe Area

```tsx
// Manual safe area padding
<div className="fixed bottom-0 left-0 right-0" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
  <button className="mx-4 h-14 w-full bg-green-600 text-white rounded-lg">
    Submit
  </button>
</div>
```

## Progressive Disclosure Example

### Good: Show Value Before Registration

```tsx
// Duolingo-style - show value first
function OnboardingFlow() {
  const [step, setStep] = useState('demo')
  
  if (step === 'demo') {
    return (
      <div className="flex flex-col h-full">
        {/* Show core value - interactive lesson */}
        <div className="flex-1 p-4">
          <InteractiveLessonDemo />
        </div>
        
        {/* Bottom CTA after user experiences value */}
        <div className="p-4">
          <button 
            onClick={() => setStep('signup')}
            className="w-full h-14 bg-green-600 text-white rounded-lg"
          >
            Continue Learning
          </button>
        </div>
      </div>
    )
  }
  
  // Only show registration after value demonstration
  return <SignupForm />
}
```

### Bad: Registration Wall

```tsx
// ❌ Registration before value demonstration
function OnboardingFlow() {
  return (
    <div>
      <h1>Welcome!</h1>
      <SignupForm /> {/* User hasn't seen value yet */}
    </div>
  )
}
```

## Platform Detection Example

```tsx
// Adapt button patterns based on platform
function PlatformAwareButton({ children, onClick }) {
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent)
  const isAndroid = /Android/.test(navigator.userAgent)
  
  if (isIOS) {
    // iOS-style bottom toolbar button
    return (
      <button 
        onClick={onClick}
        className="flex flex-col items-center min-w-[64px] min-h-[48px]"
      >
        {children}
      </button>
    )
  }
  
  if (isAndroid) {
    // Material Design bottom app bar button
    return (
      <button 
        onClick={onClick}
        className="w-12 h-12 rounded-full hover:bg-gray-100"
      >
        {children}
      </button>
    )
  }
  
  // Default web pattern
  return (
    <button onClick={onClick} className="min-w-[44px] min-h-[44px]">
      {children}
    </button>
  )
}
```

## Summary: Quick Decision Tree

```
Is this button for...

├─ NAVIGATION (switching contexts)?
│  └─ → Bottom tab bar with icons + labels
│
├─ PRIMARY ACTION (create, submit, continue)?
│  ├─ Creation? → FAB bottom-right/center
│  └─ Submission? → Bottom full-width
│
├─ CONTEXTUAL ACTIONS (edit, share, delete)?
│  ├─ iOS app? → Bottom toolbar
│  └─ Android app? → Bottom app bar
│
├─ DECISION/CONFIRMATION?
│  ├─ Destructive? → Follow content, require deliberation
│  └─ Standard? → Bottom sheet or follow content
│
└─ SECONDARY ACTION?
   └─ → Below primary, still in bottom 60% of screen
```

**Remember:** When in doubt, place it at the bottom. 75% of interactions are thumb-based.
