/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f4f1ea",
        ink: "#182126",
        primary: "#166534",
        sand: "#e7dcc7",
        mist: "#f7f5ef",
        danger: "#b42318",
      },
      boxShadow: {
        card: "0 18px 45px rgba(24, 33, 38, 0.12)",
      },
    },
  },
  plugins: [],
};
