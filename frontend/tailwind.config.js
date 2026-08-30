/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bluff-gold': '#FBBF24',
        'bluff-orange': '#F97316',
        'bluff-pink': '#F43F5E',
        'bluff-purple': '#8B5CF6',
        'bluff-purple-dark': '#6D28D9',
        'bluff-blue': '#06B6D4',
        'bluff-cyan': '#06B6D4',
        'bluff-ink': '#0A0E1A',
        'bluff-cream': '#0A0E1A',
        'bluff-charcoal': '#0F172A',
        'bluff-muted': '#94A3B8',
        'bluff-green': '#10B981',
        'bluff-red': '#F43F5E',
        'bluff-card': '#131B2E',
      },
      fontFamily: {
        display: ['Bricolage Grotesque', 'Poppins', 'sans-serif'],
        body: ['Outfit', 'Nunito Sans', 'sans-serif'],
        poppins: ['Bricolage Grotesque', 'Poppins', 'sans-serif'],
        nunito: ['Outfit', 'Nunito Sans', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px -3px rgba(251, 191, 36, 0.35)',
        'glow-purple': '0 0 25px -3px rgba(139, 92, 246, 0.4)',
        'glow-pink': '0 0 25px -3px rgba(244, 63, 94, 0.4)',
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.35)',
        'glow-green': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-soft': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
}
