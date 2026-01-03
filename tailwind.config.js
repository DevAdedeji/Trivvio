/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: '#0d59f2',
        'background-light': '#f5f6f8',
        'background-dark': '#111318',
        'surface-dark': '#1b1f27',
        'border-dark': '#282e39',
        'accent-red': '#FF3355',
        'accent-blue': '#45A3E5',
        'accent-yellow': '#FFC00A',
        'accent-green': '#66BF39',
        'card-dark': '#1a2230',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        full: '9999px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
