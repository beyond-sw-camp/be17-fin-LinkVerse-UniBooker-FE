/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 한글용
        noto: ['Noto Sans KR'],
        // 영문용
        mont: ['Montserrat'],
      },
    },
  },
  plugins: [],
}