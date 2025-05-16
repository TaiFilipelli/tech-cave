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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animationDelay:{
        200:'200ms',
        400:'400ms',
        600:'600ms',
        800:'800ms',
      },
      keyframes:{
        "fade-up":{
          '0%': { opacity:'0', transform: 'translateY(10px)' },
          '100%': { opacity:'1', transform: 'translateY(0)' },
        },
      },
      animation:{
        "fade-up":"fade-up 0.8s ease-out forwards",
      },
    },
  },
  darkMode:"class",
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
  }],
} satisfies Config;
