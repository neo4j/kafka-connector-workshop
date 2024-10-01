/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    extend: {
      backgroundColor: {
        "neo4j-bg-color": "#014063",
        "neo4j-light-gray": "#FCF9F6",
      },
      colors: {
        "neo4j-light-gray": "#FCF9F6",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
