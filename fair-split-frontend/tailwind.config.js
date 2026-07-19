/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8EC",
        coral: "#FF6B6B",
        sunny: "#FFD166",
        mint: "#06D6A0",
        sky: "#4CC9F0",
        grape: "#7B61FF",
        ink: "#2D2A32",
      },
      fontFamily: {
        display: ["'Baloo 2'", "system-ui", "sans-serif"],
        body: ["'Nunito'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        chunky: "6px 6px 0px 0px rgba(45,42,50,1)",
        "chunky-sm": "3px 3px 0px 0px rgba(45,42,50,1)",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        pop: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        wiggle: "wiggle 1s ease-in-out infinite",
        pop: "pop 0.25s ease-out",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
