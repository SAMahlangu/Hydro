/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional Water Management System Colors
        'water-primary': '#0066CC',      // Deep professional blue
        'water-secondary': '#00A8E8',    // Bright cyan blue
        'water-dark': '#003D7A',         // Dark navy
        'water-darker': '#002244',       // Deep navy
        'water-light': '#4DB8FF',        // Light blue
        'water-accent': '#0099CC',       // Accent blue
        'water-pale': '#E6F3FF',         // Very light blue
        'water-cream': '#F0F8FF',        // Alice blue
        'water-gradient-start': '#0066CC',
        'water-gradient-end': '#00A8E8',
        'water-surface': '#B3E5FC',      // Surface water blue
        'water-deep': '#01579B',         // Deep water blue
        // Legacy color aliases for backward compatibility
        'water-blue': '#0066CC',         // Alias for water-primary
        'water-warm': '#EADFB4',         // Warm beige
        'water-neutral': '#F4EBDA',      // Neutral beige
      },
      fontFamily: {
        'sans': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        'heading': ['Montserrat', 'Poppins', 'sans-serif'],
        'body': ['Inter', 'Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'water-gradient': 'linear-gradient(135deg, #0066CC 0%, #00A8E8 100%)',
        'water-gradient-light': 'linear-gradient(135deg, #E6F3FF 0%, #F0F8FF 100%)',
        'water-pattern': 'radial-gradient(circle at 20% 50%, rgba(0, 168, 232, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 102, 204, 0.1) 0%, transparent 50%)',
      },
      boxShadow: {
        'water': '0 4px 20px rgba(0, 102, 204, 0.15)',
        'water-lg': '0 8px 30px rgba(0, 102, 204, 0.2)',
        'water-xl': '0 12px 40px rgba(0, 102, 204, 0.25)',
      },
    },
  },
  plugins: [],
}

