/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx,css}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000070',           
        'primary-hover': '#00008C',   
      },
      fontFamily: {
        mont: ['Montserrat', 'sans-serif'],        
        montserrat: ['Montserrat', 'sans-serif'],
        sans: ['Noto Sans KR', 'sans-serif'],
      },
      borderRadius: {
        lg: '8px',
      },
    },
  },
  plugins: [],
}