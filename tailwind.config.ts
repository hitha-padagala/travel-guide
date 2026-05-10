import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at top left, rgba(110,163,89,0.22), transparent 35%), radial-gradient(circle at top right, rgba(168,203,160,0.22), transparent 30%), linear-gradient(135deg, rgba(247,251,242,1) 0%, rgba(237,245,232,1) 100%)'
      },
      boxShadow: {
        glow: '0 20px 80px rgba(84,121,62,0.12)'
      }
    }
  },
  plugins: []
};

export default config;
