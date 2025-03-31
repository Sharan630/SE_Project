/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          50: 'rgba(139, 92, 246, 0.5)',
        },
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        error: 'var(--error)',
        success: 'var(--success)',
      },
    },
  },
  plugins: [],
} 