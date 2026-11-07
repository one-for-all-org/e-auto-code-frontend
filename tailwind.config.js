/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: 'hsl(var(--secondary) / <alpha-value>)',
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: 'hsl(var(--accent) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        teal: {
          50: 'hsl(var(--brand-soft) / <alpha-value>)',
          200: 'hsl(var(--primary) / 0.3)',
          600: 'hsl(var(--primary) / <alpha-value>)',
          700: 'hsl(var(--primary) / <alpha-value>)',
          800: 'hsl(var(--primary) / 0.9)',
          900: 'hsl(var(--primary) / 0.8)',
        },
        stone: {
          50: 'hsl(var(--background) / <alpha-value>)',
          100: 'hsl(var(--muted) / <alpha-value>)',
          200: 'hsl(var(--border) / <alpha-value>)',
          300: 'hsl(var(--input) / <alpha-value>)',
          400: 'hsl(var(--muted-foreground) / 0.75)',
          500: 'hsl(var(--muted-foreground) / <alpha-value>)',
          600: 'hsl(var(--muted-foreground) / <alpha-value>)',
          700: 'hsl(var(--foreground) / 0.88)',
          800: 'hsl(var(--foreground) / <alpha-value>)',
          900: 'hsl(var(--foreground) / <alpha-value>)',
        },
        white: 'hsl(var(--card) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
