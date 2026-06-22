/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ocre: '#8B6F47',
        crema: '#F5EDD8',
        terracota: '#C4956A',
        salvia: '#7D9B76',
        'dark-text': '#2C2C2C',
        'light-text': '#666666',
        'off-white': '#FAFAF8',
        'aprobado': '#4CAF7D',
        'cambios': '#E8A045',
        'no-publicar': '#C0392B',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
