import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        surface: 'hsl(var(--surface))',
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        blush: 'hsl(var(--blush))',
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        success: { DEFAULT: 'hsl(var(--success))', foreground: 'hsl(var(--success-foreground))' },
        warning: { DEFAULT: 'hsl(var(--warning))', foreground: 'hsl(var(--warning-foreground))' },
        danger: { DEFAULT: 'hsl(var(--danger))', foreground: 'hsl(var(--danger-foreground))' },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'var(--font-hindi)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-hindi)', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'cursive'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 6px)',
        '2xl': 'calc(var(--radius) + 12px)',
      },
      boxShadow: {
        soft: '0 10px 30px -12px hsl(var(--primary) / 0.25)',
        card: '0 4px 20px -6px hsl(var(--foreground) / 0.12)',
      },
      backgroundImage: {
        'gradient-blush': 'linear-gradient(135deg, hsl(var(--blush)) 0%, hsl(var(--background)) 100%)',
        'gradient-berry': 'linear-gradient(135deg, hsl(346 78% 62%) 0%, hsl(346 70% 48%) 100%)',
      },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        'slide-in': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        'slide-in-left': { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        pop: { '0%': { transform: 'scale(0.5)' }, '60%': { transform: 'scale(1.25)' }, '100%': { transform: 'scale(1)' } },
        wiggle: { '0%, 100%': { transform: 'rotate(-6deg) scale(1)' }, '50%': { transform: 'rotate(2deg) scale(1.06)' } },
        'pulse-soft': { '0%, 100%': { opacity: '0.6', transform: 'scale(1)' }, '50%': { opacity: '0.9', transform: 'scale(1.05)' } },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(10px, -14px) rotate(8deg)' },
          '66%': { transform: 'translate(-8px, -6px) rotate(-6deg)' },
        },
        twinkle: { '0%, 100%': { opacity: '0.4', transform: 'scale(0.9)' }, '50%': { opacity: '1', transform: 'scale(1.15)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        float: 'float 5s ease-in-out infinite',
        'slide-in': 'slide-in 0.25s ease-out both',
        'slide-in-left': 'slide-in-left 0.25s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        // `backwards` keeps no transform after the end, so fixed-position children are not trapped.
        reveal: 'fade-up 0.6s ease-out backwards',
        pop: 'pop 0.35s ease-out',
        wiggle: 'wiggle 4s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        drift: 'drift 9s ease-in-out infinite',
        twinkle: 'twinkle 2.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
