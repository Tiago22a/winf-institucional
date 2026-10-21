/** Local CSS build for the static conversion of the ZIP's initial screen. */
module.exports = {
  content: [require('path').join(__dirname, 'index.html')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Gustavo', 'Arial', 'sans-serif'],
        heading: ['Gustavo', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        brand: ['Arial', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0,0,0,.3)',
        access: '0 4px 25px rgba(0,0,0,.4)',
        icon: '0 0 12px rgba(255,255,255,.4)',
      },
      animation: {'soft-pulse': 'pulse 2.5s ease-in-out infinite'},
    },
  },
  plugins: [],
};
