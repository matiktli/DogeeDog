import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gray: {
          100: '#f3f4f6',
        },
        green: {
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
        },
      },
      keyframes: {
        'card-load': {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'card-unload': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        in: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      },
      animation: {
        'card-load': 'card-load 1.5s ease-in-out forwards',
        'card-unload': 'card-unload 1.5s ease-in-out',
        'in': 'in 0.5s ease-out',
      },
      transitionProperty: {
        'opacity': 'opacity',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate')
  ],
} satisfies Config;
