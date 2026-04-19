import { describe, it, expect } from '@jest/globals'
import fs from 'fs'
import path from 'path'

describe('Spacing Utilities in globals.css', () => {
  const globalsPath = path.join(__dirname, '../../app/globals.css')
  const cssContent = fs.readFileSync(globalsPath, 'utf-8')

  it('should define --page-padding-x variable', () => {
    expect(cssContent).toMatch(/--page-padding-x:\s*clamp/)
  })

  it('should define .container-padding utility class', () => {
    expect(cssContent).toMatch(/\.container-padding/)
  })

  it('should define .section-spacing utility class', () => {
    expect(cssContent).toMatch(/\.section-spacing/)
  })

  it('should use clamp for responsive padding values', () => {
    // Verify clamp function with min 1rem (16px) and max 3rem (48px)
    expect(cssContent).toMatch(/clamp\(1rem,\s*5vw,\s*3rem\)/)
  })

  it('should define max-width container utility', () => {
    expect(cssContent).toMatch(/\.max-w-page/)
    expect(cssContent).toMatch(/max-width:\s*1440px/)
  })
})
