export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'gradient-move': 'gradientShift 5s ease infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
        },
      },
      backgroundSize: {
        '200': '200% 200%',
      }
    },
  },
  plugins: [],
};
