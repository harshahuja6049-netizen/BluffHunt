/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bluff-gold': '#ffbe0b',
        'bluff-orange': '#fb5607',
        'bluff-pink': '#ff006e',
        'bluff-purple': '#8338ec',
        'bluff-purple-dark': '#5b21b6',
        'bluff-blue': '#3a86ff',
        'bluff-ink': '#12081c',
        'bluff-cream': '#12081c',
        'bluff-charcoal': '#1a1024',
        'bluff-muted': '#7a7190',
        'bluff-green': '#22c55e',
        'bluff-red': '#ff006e',
      },
      fontFamily: {
        display: ['Bricolage Grotesque', 'Poppins', 'sans-serif'],
        body: ['Outfit', 'Nunito Sans', 'sans-serif'],
        poppins: ['Bricolage Grotesque', 'Poppins', 'sans-serif'],
        nunito: ['Outfit', 'Nunito Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
