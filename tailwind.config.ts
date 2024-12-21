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
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        jumpOut: {
          '0%': { 
            transform: 'scale(0.3) translateY(20px)',
            opacity: '0'
          },
          '30%': { 
            transform: 'scale(0.5) translateY(-60px)',
            opacity: '0.5'
          },
          '60%': { 
            transform: 'scale(1.2) translateY(-30px) rotate(20deg)',
            opacity: '1'
          },
          '80%': { 
            transform: 'scale(0.9) translateY(-10px) rotate(-10deg)',
          },
          '100%': { 
            transform: 'scale(1) translateY(0) rotate(0deg)',
          },
        },
        'tip-wiggle': {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' }
        }
      },
      animation: {
        'card-load': 'card-load 1.5s ease-in-out forwards',
        'card-unload': 'card-unload 1.5s ease-in-out',
        'in': 'in 0.5s ease-out',
        wiggle: 'wiggle 200ms ease-in-out',
        jumpOut: 'jumpOut 800ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'tip-wiggle': 'tip-wiggle 3s ease-in-out infinite',
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
