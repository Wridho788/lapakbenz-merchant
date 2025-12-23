/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // LapakBenz Brand Colors
        primary: {
          DEFAULT: '#191726',
          dark: '#0f0e14',
          light: '#2d2945',
        },
        secondary: {
          DEFAULT: '#2d2945',
          dark: '#1f1d31',
          light: '#3d3554',
        },
        accent: {
          DEFAULT: '#ff8800',
          hover: '#e67700',
          light: '#fff3e0',
          dark: '#cc6d00',
        },
        background: {
          DEFAULT: '#ededed',
          dark: '#e0e0e0',
          light: '#f5f5f5',
        },
      },
      boxShadow: {
        'accent': '0 4px 14px 0 rgba(255, 136, 0, 0.39)',
      },
    },
  },
  plugins: [],
}
