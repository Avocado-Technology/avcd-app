/**
 * Mock window.matchMedia for responsive testing
 * Usage: mockMatchMedia('(max-width: 767px)') for mobile tests
 */

let originalMatchMedia: typeof window.matchMedia

export function mockMatchMedia(query: string) {
  originalMatchMedia = window.matchMedia
  
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((q: string) => ({
      matches: q === query,
      media: q,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

export function restoreMatchMedia() {
  if (originalMatchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    })
  }
}

// Add minimal test to satisfy Jest
if (typeof describe !== 'undefined') {
  describe('mockMatchMedia utility', () => {
    it('exports mockMatchMedia function', () => {
      expect(typeof mockMatchMedia).toBe('function')
    })

    it('exports restoreMatchMedia function', () => {
      expect(typeof restoreMatchMedia).toBe('function')
    })
  })
}
