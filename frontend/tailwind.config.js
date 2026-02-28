/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#edfff4',
                    100: '#d5ffe6',
                    200: '#aeffcf',
                    300: '#70ffaa',
                    400: '#2bfd7e',
                    500: '#00e85d',
                    600: '#00c04a',
                    700: '#00963d',
                    800: '#067533',
                    900: '#07602c',
                    950: '#003717',
                },
                surface: {
                    50: '#f6f7f9',
                    100: '#eceef2',
                    200: '#d5d9e2',
                    300: '#b0b9c9',
                    400: '#8694ab',
                    500: '#677691',
                    600: '#525f78',
                    700: '#434e62',
                    800: '#3a4353',
                    900: '#1e2330',
                    950: '#0f1219',
                },
                waste: { DEFAULT: '#ef4444', light: '#fca5a5', dark: '#991b1b' },
                secure: { DEFAULT: '#22c55e', light: '#86efac', dark: '#166534' },
                caution: { DEFAULT: '#f59e0b', light: '#fcd34d', dark: '#92400e' },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'pulse-slow': 'pulse 3s ease-in-out infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'slide-right': 'slideRight 0.3s ease-out',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
                slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
                slideRight: { from: { opacity: 0, transform: 'translateX(-12px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
                glow: { from: { boxShadow: '0 0 5px rgba(0,232,93,0.2)' }, to: { boxShadow: '0 0 20px rgba(0,232,93,0.4)' } },
            },
        },
    },
    plugins: [],
};
