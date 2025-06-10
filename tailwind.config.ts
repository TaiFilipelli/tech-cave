import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";

import { heroui } from "@heroui/react";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		animationDelay: {
  			'200': '200ms',
  			'400': '400ms',
  			'600': '600ms',
  			'800': '800ms'
  		},
  		keyframes: {
  			'fade-up': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(10px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			}
  		},
  		animation: {
  			'fade-up': 'fade-up 0.8s ease-out forwards'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  darkMode:["class", "class"],
  plugins: [
      heroui(), 
      function ({ addUtilities }:PluginAPI ) {
       addUtilities({
        '.animation-delay-100': { animationDelay: '100ms' },
        '.animation-delay-200': { animationDelay: '200ms' },
        '.animation-delay-300': { animationDelay: '300ms' },
        '.animation-delay-400': { animationDelay: '400ms' },
        '.animation-delay-500': { animationDelay: '500ms' },
        '.animation-delay-600': { animationDelay: '600ms' },
        '.animation-delay-700': { animationDelay: '700ms' },
        '.animation-delay-800': { animationDelay: '800ms' },
        '.animation-delay-900': { animationDelay: '900ms' },
        '.animation-delay-1000': { animationDelay: '1000ms' },
      })
  },
      require("tailwindcss-animate")
],
} satisfies Config;
