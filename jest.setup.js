/* eslint-disable @typescript-eslint/no-require-imports, react/display-name */
import '@testing-library/jest-dom'
import { toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

// Auth session: avoid loading Auth.js Keycloak provider in Jest.
jest.mock("@/lib/auth/session", () => require("./__tests__/mocks/auth-session.js"));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: (namespace) => (key) => namespace ? `${namespace}.${key}` : key,
  useFormatter: () => ({
    dateTime: (date, opts) => date.toLocaleDateString('en-US', opts),
  }),
}));

// Mock i18n navigation
jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>,
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  redirect: jest.fn(),
}));

jest.mock('@/components/ui/sheet', () => {
  const React = require('react');
  return {
    Sheet: ({ children }) => <div>{children}</div>,
    SheetContent: ({ children }) => <div role="dialog">{children}</div>,
    SheetTrigger: ({ children, asChild }) => {
      if (asChild) return children;
      return <button>{children}</button>;
    },
    SheetTitle: ({ children }) => <div>{children}</div>,
    SheetHeader: ({ children }) => <div>{children}</div>,
    SheetFooter: ({ children }) => <div>{children}</div>,
    SheetDescription: ({ children }) => <div>{children}</div>,
    SheetClose: ({ children }) => <button>{children}</button>,
  };
});

// Mock sidebar context and components globally
jest.mock('@/components/ui/sidebar', () => {
  const React = require('react');
  return {
    SidebarMenu: ({ children }) => <div data-testid="sidebar-menu">{children}</div>,
    SidebarMenuItem: ({ children }) => <div data-testid="sidebar-menu-item">{children}</div>,
    SidebarMenuButton: React.forwardRef(({ children, isActive, asChild, ...props }, ref) => {
      // Mirror real sidebarMenuButtonVariants defaults (touch targets on mobile).
      const baseCls = 'h-11 min-h-[44px] flex w-full items-center gap-2 overflow-hidden rounded-md p-2';
      const activeCls = isActive ? 'bg-gray-100' : '';
      if (asChild && React.isValidElement(children)) {
        const merged = [children.props.className, baseCls, activeCls].filter(Boolean).join(' ');
        return React.cloneElement(children, {
          ref,
          className: merged || undefined,
          ...props
        });
      }
      return (
        <button type="button" ref={ref} className={[baseCls, activeCls].filter(Boolean).join(' ') || undefined} {...props}>{children}</button>
      );
    }),
    SidebarProvider: ({ children }) => <div data-testid="sidebar-provider">{children}</div>,
    useSidebar: () => ({
      state: "expanded",
      open: true,
      setOpen: jest.fn(),
      openMobile: true,
      setOpenMobile: jest.fn(),
      isMobile: true,
      toggleSidebar: jest.fn(),
    }),
  Sidebar: React.forwardRef(({ children, ...props }, ref) => (
    <div ref={ref} data-testid="sidebar" {...props}>{children}</div>
  )),
  SidebarHeader: ({ children }) => <div data-testid="sidebar-header">{children}</div>,
  SidebarContent: ({ children }) => <div data-testid="sidebar-content">{children}</div>,
  SidebarFooter: ({ children }) => <div data-testid="sidebar-footer">{children}</div>,
  SidebarGroup: ({ children }) => <div data-testid="sidebar-group">{children}</div>,
  SidebarGroupLabel: ({ children }) => <div data-testid="sidebar-group-label">{children}</div>,
  SidebarGroupContent: ({ children }) => <div data-testid="sidebar-group-content">{children}</div>,
  SidebarTrigger: () => <button data-testid="sidebar-trigger">trigger</button>,
  SidebarRail: () => <div data-testid="sidebar-rail">rail</div>,
  SidebarInset: ({ children }) => <div data-testid="sidebar-inset">{children}</div>,
  };
});

// Minimal matchMedia for hooks (tests may replace with mockMatchMedia).
// Skip when running @jest-environment node suites (no window).
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

// Mock environment variables
process.env.AUTH_SECRET = 'test-secret-key-for-keycloak-testing-only-32-chars'
process.env.APP_BASE_URL = 'http://localhost:3000'
process.env.KEYCLOAK_URL = 'http://localhost:8080'
process.env.KEYCLOAK_REALM = 'avcd'
process.env.KEYCLOAK_CLIENT_ID = 'avcd-web'
process.env.KEYCLOAK_CLIENT_SECRET = 'test-client-secret-value-long-enough'
process.env.KEYCLOAK_AUDIENCE = 'https://dev.avcd.ai/api'

// Mock ResizeObserver for ReactFlow
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
