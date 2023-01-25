const TOPBAR_HEIGHT = '40px'
const BODY_HEIGHT = `calc(100vh - ${TOPBAR_HEIGHT})`

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      height: {
        topbar: TOPBAR_HEIGHT,
        body: BODY_HEIGHT,
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Other potentialy useful plugins:
    // require('@tailwindcss/line-clamp'),
    // require('@tailwindcss/aspect-ratio'),
    require('daisyui'),
  ],
  daisyui: {
    logs: false,
  },
}
