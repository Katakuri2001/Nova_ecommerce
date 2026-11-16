export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        nova: {
          50: '#f0f4ff', 100: '#e0e8ff', 200: '#c7d5fe', 300: '#a3bfff',
          400: '#7f9dfe', 500: '#5a7bfe', 600: '#4258f9', 700: '#3541e0',
          800: '#2d36b8', 900: '#2a318a', 950: '#1a1f4a',
        },
        // Figma design accent blue
        blue: {
          50: '#eef4ff', 100: '#dce8ff', 200: '#b8d0ff', 300: '#91acff',
          400: '#729fff', 500: '#4d8cff', 600: '#3a75e8', 700: '#2d5ec4',
          800: '#234a9e', 900: '#1c3b7e', 950: '#112550',
        },
        surface: {
          50: '#f5f7ff', 100: '#e8ecf5', 200: '#c8d0e0', 300: '#a5b3c8',
          400: '#718096', 500: '#596579', 600: '#4f5b70', 700: '#3a4556',
          800: '#2a3344', 900: '#111724', 950: '#080b14',
        },
        ink: '#f5f7ff',
        muted: '#a5b3c8',
        dim: '#718096',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px', '2xl': '28px', '3xl': '32px' },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};