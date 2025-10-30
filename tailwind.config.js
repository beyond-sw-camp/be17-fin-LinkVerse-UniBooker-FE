/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx,css}'],
  theme: {
    extend: {
      colors: {
        // 블루 계열
        primary: '#00008C',
        'primary-back': '#1E3A8A',
        'primary-bright': '#2563EB',
        'primary-bbright': '#60A5FA',
        'primary-hover': '#000070',

        // 폰트 컬러
        text: '#222222',

        // 그레이 계열
        'gray-line': '#EEEEEE',
        'gray-deep': '#DDDDDD',
        'gray-dark': '#555555',

        // 기본 컬러
        black: '#000000',
        white: '#FFFFFF',
      },
      fontFamily: {
        'mont-noto': ['Montserrat', 'Noto Sans KR', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
