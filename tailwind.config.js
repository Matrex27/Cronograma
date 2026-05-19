/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#168DCA",
          blueDark: "#0A5D8F",
          gold: "#D99A24",
          red: "#C92525",
          ink: "#0A0A0A",
          surface: "#F5F9FC",
        },
      },
    },
  },
  plugins: [],
};
