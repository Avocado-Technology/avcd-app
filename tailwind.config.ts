import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			bg: 'var(--bg)',
  			green: {
  				DEFAULT: 'var(--green)',
  				light: 'var(--green-lt)',
  				border: 'var(--green-bd)'
  			},
  			gray: {
  				'50': 'var(--g50)',
  				'100': 'var(--g100)',
  				'200': 'var(--g200)',
  				'300': 'var(--g300)',
  				'400': 'var(--g400)',
  				'500': 'var(--g500)',
  				'700': 'var(--g700)',
  				'900': 'var(--g900)'
  			},
  			amber: {
  				DEFAULT: 'var(--amber)',
  				light: 'var(--amber-lt)',
  				border: 'var(--amber-bd)'
  			},
  			red: {
  				DEFAULT: 'var(--red)',
  				light: 'var(--red-lt)',
  				border: 'var(--red-bd)'
  			},
  		sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			muted: {
  				DEFAULT: 'var(--muted)',
  				foreground: 'var(--muted-foreground)'
  			},
  			border: 'var(--border)',
  			input: 'var(--input)',
  			ring: 'var(--ring)',
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: 'var(--primary-foreground)'
  			},
  			secondary: {
  				DEFAULT: 'var(--secondary)',
  				foreground: 'var(--secondary-foreground)'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'var(--sans)',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'var(--mono)',
  				'monospace'
  			]
  		},
  		spacing: {
  			'touch-min': '44px',
  			'touch-comfortable': '48px',
  			'touch-primary': '56px',
  			'1': '0.25rem',
  			'2': '0.5rem',
  			'3': '0.75rem',
  			'4': '1rem',
  			'5': '1.25rem',
  			'6': '1.5rem',
  			'8': '2rem',
  			'10': '2.5rem',
  			'12': '3rem',
  			'16': '4rem',
  			'20': '5rem',
  			'24': '6rem',
  			'32': '8rem'
  		},
  		borderRadius: {
  			sm: '4px',
  			md: '6px',
  			lg: '10px',
  			xl: '14px'
  		},
  		maxWidth: {
  			container: '1080px'
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
}

export default config
