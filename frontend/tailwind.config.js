/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    purple: '#667eea',
                    dark: '#764ba2',
                },
                accent: {
                    pink: '#ff6b9d',
                    orange: '#ff8a56',
                    yellow: '#ffd93d',
                },
                bg: {
                    primary: '#0f0f23',
                    secondary: '#1a1a2e',
                    card: '#16213e',
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#a0a0a0',
                    accent: '#e0e0e0',
                },
                glass: {
                    bg: 'rgba(255, 255, 255, 0.1)',
                    border: 'rgba(255, 255, 255, 0.2)',
                }
            },
            backgroundImage: {
                'primary-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'hero-gradient': 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            },
            boxShadow: {
                'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
                'neon': '0 0 20px rgba(102, 126, 234, 0.3)',
                'neon-pink': '0 0 20px rgba(255, 107, 157, 0.3)',
            },
            backdropBlur: {
                'glass': '20px',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
                'pulse-glow': 'pulseGlow 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(102, 126, 234, 0.3)' },
                    '50%': { boxShadow: '0 0 30px rgba(102, 126, 234, 0.6)' },
                },
            },
        },
    },
    plugins: [],
} 