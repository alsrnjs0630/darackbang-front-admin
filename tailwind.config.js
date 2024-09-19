/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [ // tailwindCSS를 적용할 파일 확장자 설정
      "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: { // tailwindCSS의 테마 설정
    extend: {},
  },
  plugins: [], // tailwindCSS 플러그인 설정
});

