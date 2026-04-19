# shadcn/ui Development Skill

Comprehensive guide for building React components using shadcn/ui component system.

## Description

This skill provides guidance for using **shadcn/ui** - a component distribution system that copies beautifully designed, accessible components directly into your codebase. Unlike traditional component libraries, shadcn/ui gives you full ownership and control over the components.

## When to Use This Skill

Trigger this skill when:
- Building UI components, forms, or layouts
- Adding new components via CLI (`npx shadcn@latest add`)
- Customizing or composing shadcn/ui components
- Working with Radix UI primitives (shadcn's foundation)
- Creating accessible, WCAG-compliant interfaces
- User mentions: "add a component", "shadcn", "ui component", "form", "dialog", "dropdown"

## Core Principles

### 1. **Open Code Philosophy**
- Components are copied into your `/components/ui/` directory
- You own the code - modify freely without breaking changes
- No npm dependencies to update (beyond Radix UI primitives)

### 2. **Composition Over Configuration**
- Build complex UIs by composing smaller components
- Example: `Card` + `CardHeader` + `CardContent` + `CardFooter`
- Don't create monolithic components

### 3. **Accessibility First**
- All components built on Radix UI primitives (WAI-ARIA compliant)
- Keyboard navigation built-in
- Screen reader support included
- Focus management handled automatically

## Installation & Setup

### Check Project Configuration
Always verify your `components.json` first:
```bash
npx shadcn@latest info --json
```

This shows:
- Framework (Next.js, Vite, etc.)
- Tailwind version (v3 vs v4)
- Path aliases (@/components, etc.)
- Style variant (new-york, default)
- Base library (radix or base)
- Installed components

### Adding Components
```bash
# Add single component
npx shadcn@latest add button

# Add multiple components
npx shadcn@latest add button card dialog

# Preview changes without installing (dry run)
npx shadcn@latest add button --dry-run

# Show diff when updating existing components
npx shadcn@latest add button --diff

# Search for components
npx shadcn@latest search
```

### Documentation Lookup
```bash
# Get component documentation
npx shadcn@latest docs button
npx shadcn@latest docs dialog
```

## Component Architecture

### Path Structure
```
your-project/
├── components/
│   ├── ui/              # shadcn components (managed)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   └── custom/          # Your custom components
│       ├── header.tsx
│       └── sidebar.tsx
├── lib/
│   └── utils.ts         # cn() helper for className merging
└── components.json      # shadcn configuration
```

### Component Composition Patterns

#### ✅ CORRECT: Compose from shadcn components
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ProductCard({ title, price }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">${price}</p>
        <Button>Add to Cart</Button>
      </CardContent>
    </Card>
  )
}
```

#### ❌ INCORRECT: Creating custom markup
```tsx
// Don't do this - use Card component instead
export function ProductCard() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6">
        {/* ... */}
      </div>
    </div>
  )
}
```

## Available Components

### Layout & Structure
- **Card** - Container with header, content, footer sections
- **Separator** - Visual content divider
- **Scroll Area** - Custom scrollable regions
- **Resizable** - Adjustable panel layouts
- **Sidebar** - Composable sidebar navigation (NEW)

### Forms & Inputs
- **Button** - Interactive buttons with variants
- **Input** - Text input fields
- **Textarea** - Multi-line text input
- **Select** - Dropdown selection (or NativeSelect for HTML select)
- **Checkbox** - Toggle checkboxes
- **Radio Group** - Single-choice selection
- **Switch** - Toggle switch control
- **Slider** - Range input slider
- **Calendar / Date Picker** - Date selection
- **Combobox** - Autocomplete search input
- **Input OTP** - One-time password input
- **Field** - Form field composition (label + control + help text)

### Overlays & Dialogs
- **Dialog** - Modal windows
- **Sheet** - Slide-in panels
- **Drawer** - Mobile-friendly drawers
- **Popover** - Contextual popovers
- **Hover Card** - Preview on hover
- **Tooltip** - Informational tooltips
- **Alert Dialog** - Confirmation dialogs

### Navigation
- **Navigation Menu** - Header navigation
- **Menubar** - Desktop-style menu bar
- **Dropdown Menu** - Action menus
- **Context Menu** - Right-click menus
- **Tabs** - Tabbed interfaces
- **Breadcrumb** - Hierarchical navigation
- **Pagination** - Page navigation

### Feedback & Status
- **Alert** - Callout messages
- **Toast** / **Sonner** - Notification toasts
- **Progress** - Progress indicators
- **Spinner** - Loading spinners
- **Skeleton** - Loading placeholders
- **Badge** - Status badges
- **Empty** - Empty state displays

### Data Display
- **Table** - Data tables
- **Data Table** - Advanced tables (TanStack Table)
- **Avatar** - User avatars
- **Chart** - Data visualizations (Recharts)
- **Carousel** - Image/content carousels
- **Accordion** - Collapsible content
- **Collapsible** - Expandable panels
- **Typography** - Text styling system

### Utilities
- **Command** - Command palette (⌘K style)
- **Toggle** / **Toggle Group** - Toggle buttons
- **Aspect Ratio** - Maintain image ratios
- **Kbd** - Keyboard shortcut display
- **Label** - Form labels
- **Item** - Generic content item

## Best Practices

### 1. Always Check Before Adding
```bash
# Check if component already exists
ls components/ui/ | grep button

# Or check via CLI
npx shadcn@latest info --json
```

### 2. Use Built-in Variants
Don't create custom buttons when variants exist:
```tsx
// ✅ Use built-in variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Skip</Button>

// ❌ Don't create custom variants unnecessarily
<Button className="bg-red-500 text-white">Delete</Button>
```

### 3. Form Composition with Field
```tsx
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<FieldGroup>
  <Field>
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" />
    <p className="text-sm text-muted-foreground">
      We'll never share your email.
    </p>
  </Field>
</FieldGroup>
```

### 4. Dialog Accessibility
Always include `DialogTitle`:
```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      {/* Required for accessibility! */}
    </DialogHeader>
    {/* ... */}
  </DialogContent>
</Dialog>
```

### 5. className Merging with cn()
```tsx
import { cn } from "@/lib/utils"

<Button
  className={cn(
    "w-full",
    isLoading && "opacity-50 cursor-not-allowed"
  )}
>
  Submit
</Button>
```

### 6. Never Manually Fetch from GitHub
```bash
# ❌ DON'T manually copy from GitHub
curl https://raw.githubusercontent.com/shadcn-ui/ui/...

# ✅ DO use the CLI
npx shadcn@latest add button
```

## Framework-Specific Setup

### Next.js (App Router)
```json
// components.json
{
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css"
  }
}
```

### Vite + React
```json
{
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css"
  }
}
```

## Styling & Theming

### CSS Variables (Tailwind v3)
```css
/* app/globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* ... */
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... */
  }
}
```

### Dark Mode
```tsx
// Use next-themes or similar
import { ThemeProvider } from "next-themes"

<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```

## Common Patterns

### 1. Loading States
```tsx
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

<Button disabled={isLoading}>
  {isLoading && <Spinner className="mr-2" />}
  Submit
</Button>
```

### 2. Form Validation with Toast
```tsx
import { useToast } from "@/hooks/use-toast"

const { toast } = useToast()

function onSubmit(data) {
  toast({
    title: "Success",
    description: "Your profile has been updated.",
  })
}
```

### 3. Command Palette (⌘K)
```tsx
import { Command, CommandInput, CommandList } from "@/components/ui/command"

<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
      <CommandItem>Search Emoji</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

### 4. Data Table Pattern
```tsx
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"

<DataTable columns={columns} data={data} />
```

## Troubleshooting

### Component Not Found After Adding
1. Check `components.json` for correct paths
2. Verify import aliases in `tsconfig.json`
3. Restart dev server

### Styling Not Applied
1. Ensure Tailwind CSS is configured
2. Check `globals.css` imports CSS variables
3. Verify `tailwind.config` includes component paths

### TypeScript Errors
```bash
# Regenerate types
npx shadcn@latest add --overwrite
```

## Integration with Other Tools

### With React Hook Form
```tsx
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const { register, handleSubmit } = useForm()

<form onSubmit={handleSubmit(onSubmit)}>
  <Input {...register("email")} />
  <Button type="submit">Submit</Button>
</form>
```

### With TanStack Table
```bash
npx shadcn@latest add data-table
```
This includes full TanStack Table integration.

### With Recharts (Charts)
```bash
npx shadcn@latest add chart
```

## Resources

- **Official Docs**: https://ui.shadcn.com/docs
- **Component Directory**: https://ui.shadcn.com/docs/components
- **Community Registry**: https://ui.shadcn.com/docs/directory
- **Blocks (Pre-built Layouts)**: https://ui.shadcn.com/blocks
- **GitHub**: https://github.com/shadcn-ui/ui

## Version Notes

- **Tailwind v4**: If using Tailwind v4, ensure `components.json` specifies `"tailwindVersion": "v4"`
- **Style Variants**: Supports `new-york` and `default` styles
- **Base vs Radix**: Most components use Radix UI; some use vanilla HTML

## AI-Assisted Development Tips

1. **Always run `info` first** to understand project setup
2. **Use `docs` command** to get accurate API references
3. **Respect project configuration** (icon library, style, etc.)
4. **Compose, don't reinvent** - use existing components
5. **Check for updates** with `--diff` flag when updating components

---

**Last Updated**: April 2026  
**shadcn/ui Version**: Latest (Check docs for current version)
