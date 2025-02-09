/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#111827',
          800: '#1F2937',
          700: '#374151',
          600: '#4B5563',
          500: '#6B7280',
          400: '#9CA3AF',
          300: '#D1D5DB',
          200: '#E5E7EB',
          100: '#F3F4F6',
        },
        blue: {
          700: '#1D4ED8',
          600: '#2563EB',
          500: '#3B82F6',
          400: '#60A5FA',
          300: '#93C5FD',
        },
        green: {
          700: '#15803D',
          600: '#16A34A',
          500: '#22C55E',
        },
        red: {
          500: '#EF4444',
        },
        yellow: {
          500: '#EAB308',
        },
      },
      spacing: {
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '90rem',
      },
      minHeight: {
        'screen-without-header': 'calc(100vh - 4rem)',
      },
      gridTemplateColumns: {
        'auto-fill-cards': 'repeat(auto-fill, minmax(280px, 1fr))',
      },
    },
  },
  plugins: [],
}
