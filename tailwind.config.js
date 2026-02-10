module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // other paths
  ],
 

// tailwind.config.js
theme: {
  extend: {
    animation: {
      "fade-in": "fadeIn 1s ease-in forwards",
      "spin-slow": "spin 1.2s linear infinite",
      'shimmer-text': 'shimmer 3s linear infinite',
      'gentle-float': 'float 6s ease-in-out infinite',
      'glow-pulse': 'glow 3s ease-in-out infinite alternate',
      'unfold-slow': 'unfold 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    },
    keyframes: {
      shimmer: {
        '0%': { backgroundPosition: '200% center' },
        '100%': { backgroundPosition: '-200% center' },
      },
      float: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-10px)' },
      },
      glow: {
        '0%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)', opacity: '0.8' },
        '100%': { boxShadow: '0 0 40px rgba(34, 197, 94, 0.6)', opacity: '1' },
      },
       unfold: {
        '0%': { opacity: '0', transform: 'scaleY(0) translateY(20px)' },
        '100%': { opacity: '1', transform: 'scaleY(1) translateY(0)' },
      },
    },
  },
}
}