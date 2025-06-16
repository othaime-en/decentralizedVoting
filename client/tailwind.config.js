/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        epilogue: ["Epilogue", "sans-serif"],
      },
      boxShadow: {
        secondary: "10px 10px 20px rgba(2, 2, 2, 0.25)",
      },
      colors: {
        dark: {
          primary: '#13131a',
          secondary: '#1c1c24',
          accent: '#2c2f32',
          text: {
            primary: '#ffffff',
            secondary: '#808191',
            accent: '#b2b3bd'
          }
        },
        light: {
          primary: '#ffffff',
          secondary: '#f5f5f5',
          accent: '#e5e7eb',
          text: {
            primary: '#1f2937',
            secondary: '#4b5563',
            accent: '#6b7280'
          }
        }
      },
    },
  },
  plugins: [],
};
