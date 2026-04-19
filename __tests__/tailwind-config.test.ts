import { describe, it, expect } from '@jest/globals'
import * as fs from 'fs'
import * as path from 'path'

describe('Tailwind Configuration', () => {
  it('should have tailwind.config.ts file', () => {
    const configPath = path.join(process.cwd(), 'tailwind.config.ts')
    expect(fs.existsSync(configPath)).toBe(true)
  })

  it('should have postcss.config.mjs file', () => {
    const configPath = path.join(process.cwd(), 'postcss.config.mjs')
    expect(fs.existsSync(configPath)).toBe(true)
  })

  it('should have globals.css with Tailwind directives', () => {
    const cssPath = path.join(process.cwd(), 'app/globals.css')
    const cssContent = fs.readFileSync(cssPath, 'utf-8')
    
    expect(cssContent).toContain('@tailwind base')
    expect(cssContent).toContain('@tailwind components')
    expect(cssContent).toContain('@tailwind utilities')
  })

  it('should have Avocado design tokens as CSS variables', () => {
    const cssPath = path.join(process.cwd(), 'app/globals.css')
    const cssContent = fs.readFileSync(cssPath, 'utf-8')
    
    // Check for color tokens
    expect(cssContent).toContain('--bg:')
    expect(cssContent).toContain('--g50:')
    expect(cssContent).toContain('--g100:')
    expect(cssContent).toContain('--green:')
    
    // Check for spacing tokens
    expect(cssContent).toContain('--sp-')
    
    // Check for font tokens
    expect(cssContent).toContain('--sans:')
    expect(cssContent).toContain('--mono:')
  })

  it('should configure Tailwind with custom colors', () => {
    const config = require('../tailwind.config.ts')
    
    expect(config.default.theme.extend.colors).toBeDefined()
    expect(config.default.theme.extend.colors.gray).toBeDefined()
    expect(config.default.theme.extend.colors.green).toBeDefined()
  })

  it('should configure Tailwind with custom spacing', () => {
    const config = require('../tailwind.config.ts')
    
    expect(config.default.theme.extend.spacing).toBeDefined()
    expect(config.default.theme.extend.spacing['1']).toBe('0.25rem')
    expect(config.default.theme.extend.spacing['32']).toBe('8rem')
  })

  it('should configure Tailwind with custom border radius', () => {
    const config = require('../tailwind.config.ts')
    
    expect(config.default.theme.extend.borderRadius).toBeDefined()
    expect(config.default.theme.extend.borderRadius.sm).toBe('4px')
    expect(config.default.theme.extend.borderRadius.xl).toBe('14px')
  })

  it('should configure Tailwind with Geist font family', () => {
    const config = require('../tailwind.config.ts')
    
    expect(config.default.theme.extend.fontFamily).toBeDefined()
    expect(config.default.theme.extend.fontFamily.sans).toContain('var(--sans)')
    expect(config.default.theme.extend.fontFamily.mono).toContain('var(--mono)')
  })

  it('should include tailwindcss-animate plugin', () => {
    const config = require('../tailwind.config.ts')
    
    expect(config.default.plugins).toBeDefined()
    expect(config.default.plugins.length).toBeGreaterThan(0)
  })
})
