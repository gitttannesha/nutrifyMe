module.exports = {
  theme: {
    extend: {
      keyframes: {
        flipIn: {
          '0%': { transform: 'rotateY(90deg)', opacity: '0' },
          '100%': { transform: 'rotateY(0deg)', opacity: '1' },
        },
      },
      animation: {
        flipIn: 'flipIn 0.7s cubic-bezier(0.4,0.2,0.2,1) both',
      },
      perspective: {
        1000: '1000px',
      },
    },
  },
  plugins: [
    function({ addUtilities }: any) {
      addUtilities({
        '.perspective-1000': {
          perspective: '1000px',
        },
      });
    }
  ],
}; 