import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at top left, rgba(30,64,175,0.22), transparent 30%), radial-gradient(circle at top right, rgba(15,23,42,0.20), transparent 28%), linear-gradient(135deg, rgba(235,242,255,1) 0%, rgba(219,230,247,1) 100%)'
      },
      boxShadow: {
        glow: '0 20px 80px rgba(29,78,216,0.12)'
      }
    }
  },
  plugins: []
};

export default config;
