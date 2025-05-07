module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // other paths
  ],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 1s ease-in forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
