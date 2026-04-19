import { describe, it, expect } from '@jest/globals'
import * as fs from 'fs'
import * as path from 'path'

describe('shadcn/ui Configuration', () => {
  it('should have components.json file', () => {
    const configPath = path.join(process.cwd(), 'components.json')
    expect(fs.existsSync(configPath)).toBe(true)
  })

  it('should configure correct component paths', () => {
    const configPath = path.join(process.cwd(), 'components.json')
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    
    expect(config.aliases.components).toBe('@/components')
    expect(config.aliases.utils).toBe('@/lib/utils')
  })

  it('should use TypeScript', () => {
    const configPath = path.join(process.cwd(), 'components.json')
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    
    expect(config.tsx).toBe(true)
  })

  it('should have lib/utils.ts file', () => {
    const utilsPath = path.join(process.cwd(), 'lib/utils.ts')
    expect(fs.existsSync(utilsPath)).toBe(true)
  })

  it('should have cn() utility function', () => {
    const utilsPath = path.join(process.cwd(), 'lib/utils.ts')
    const utilsContent = fs.readFileSync(utilsPath, 'utf-8')
    
    expect(utilsContent).toContain('export function cn(')
    expect(utilsContent).toContain('clsx')
    expect(utilsContent).toContain('twMerge')
  })

  it('should have components/ui directory', () => {
    const uiPath = path.join(process.cwd(), 'components/ui')
    expect(fs.existsSync(uiPath)).toBe(true)
  })
})

describe('cn() Utility Function', () => {
  it('should merge class names correctly', () => {
    const { cn } = require('../lib/utils')
    
    const result = cn('px-4', 'py-2', 'bg-green')
    expect(result).toContain('px-4')
    expect(result).toContain('py-2')
    expect(result).toContain('bg-green')
  })

  it('should handle conditional classes', () => {
    const { cn } = require('../lib/utils')
    
    const result = cn('px-4', true && 'py-2', false && 'hidden')
    expect(result).toContain('px-4')
    expect(result).toContain('py-2')
    expect(result).not.toContain('hidden')
  })

  it('should merge conflicting Tailwind classes', () => {
    const { cn } = require('../lib/utils')
    
    // twMerge should keep only the last value
    const result = cn('px-4', 'px-8')
    expect(result).toContain('px-8')
    expect(result).not.toContain('px-4')
  })
})
