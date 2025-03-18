/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: ["./views/**/*.{html,ejs}"],
  theme: {
    extend: {
      colors: {
        amber: colors.amber,
        emerald: colors.emerald,
      }

    },
  },
  plugins: [],
}