import { Button } from '@/components/ui/button'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent, 
  CardFooter 
} from '@/components/ui/card'

export default function TestDesignSystemPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-container mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-semibold tracking-tight mb-2">
            Avocado Design System
          </h1>
          <p className="text-gray-500 font-light">
            Testing shadcn/ui + Radix + Tailwind + Motion setup
          </p>
        </header>

        <section>
          <h2 className="text-2xl font-medium mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="green">Green CTA</Button>
            <Button variant="destructive">Destructive</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-medium mb-4">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Simple Card</CardTitle>
                <CardDescription>A basic card example</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  This card demonstrates the Avocado design system styling with
                  1px borders and no box shadows.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>With actions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">
                  Cards can contain interactive elements like buttons.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="green">Learn More</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Card</CardTitle>
                <CardDescription>With live indicator</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green animate-pulse" />
                  <span className="text-sm font-mono text-gray-500">Live</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-medium mb-4">Typography</h2>
          <div className="space-y-4">
            <p className="text-gray-900 font-semibold text-xl">
              Heading - Geist 600
            </p>
            <p className="text-gray-700">
              Body text - Geist 400
            </p>
            <p className="text-gray-500 font-light">
              Light text - Geist 300
            </p>
            <p className="font-mono text-sm text-gray-500">
              Monospace metadata - Geist Mono 400
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-medium mb-4">Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="h-20 bg-gray-900 rounded-lg mb-2" />
              <p className="text-sm font-mono">gray-900</p>
            </div>
            <div>
              <div className="h-20 bg-gray-700 rounded-lg mb-2" />
              <p className="text-sm font-mono">gray-700</p>
            </div>
            <div>
              <div className="h-20 bg-gray-500 rounded-lg mb-2" />
              <p className="text-sm font-mono">gray-500</p>
            </div>
            <div>
              <div className="h-20 bg-gray-200 rounded-lg mb-2" />
              <p className="text-sm font-mono">gray-200</p>
            </div>
            <div>
              <div className="h-20 bg-green rounded-lg mb-2" />
              <p className="text-sm font-mono">green</p>
            </div>
            <div>
              <div className="h-20 bg-green-light rounded-lg mb-2" />
              <p className="text-sm font-mono">green-light</p>
            </div>
            <div>
              <div className="h-20 bg-amber rounded-lg mb-2" />
              <p className="text-sm font-mono">amber</p>
            </div>
            <div>
              <div className="h-20 bg-red rounded-lg mb-2" />
              <p className="text-sm font-mono">red</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-medium mb-4">Test Checklist</h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✅ All 56 automated tests passing</li>
                <li>📋 Button hover states work</li>
                <li>📋 Button active state translates down 1px</li>
                <li>📋 Card hover changes border color</li>
                <li>📋 No box shadows on any elements</li>
                <li>📋 Geist fonts loading correctly</li>
                <li>📋 Dark mode works (toggle in DevTools)</li>
                <li>📋 Reduced motion respected (toggle in DevTools)</li>
                <li>📋 Responsive layout works</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
