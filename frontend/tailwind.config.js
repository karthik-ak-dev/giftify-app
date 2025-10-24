/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Dark Arcade Purple Palette (from design.json)
                bg: {
                    deep: '#0E0725',
                    base: '#140B2D',
                    elevated: '#1D0F45',
                },
                panel: '#24115A',
                card: '#2A1260',
                surface: {
                    hover: '#331A78',
                },
                border: '#4C2CA0',
                text: {
                    high: '#FFFFFF',
                    med: '#E7DFFF',
                    low: '#BFB2EF',
                },
                primary: {
                    DEFAULT: '#8A2BE2',
                    300: '#B27CFF',
                    600: '#6C23CB',
                },
                accent: {
                    pink: '#FF3CAC',
                    blue: '#2DD4FF',
                    yellow: '#F9D45C',
                },
                success: '#22C55E',
                warning: '#F59E0B',
                danger: '#EF4444',
                brand: {
                    glow: 'rgba(146, 64, 255, 0.45)',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                'display-xxl': ['56px', { lineHeight: '64px', fontWeight: '800', letterSpacing: '-0.5px' }],
                'display-xl': ['40px', { lineHeight: '48px', fontWeight: '800', letterSpacing: '-0.25px' }],
                'h1': ['28px', { lineHeight: '34px', fontWeight: '800' }],
                'h2': ['22px', { lineHeight: '28px', fontWeight: '700' }],
                'h3': ['18px', { lineHeight: '24px', fontWeight: '700' }],
                'label': ['13px', { lineHeight: '16px', fontWeight: '700' }],
                'body': ['14px', { lineHeight: '20px', fontWeight: '500' }],
                'caption': ['12px', { lineHeight: '16px', fontWeight: '500' }],
            },
            borderRadius: {
                'xs': '8px',
                'sm': '12px',
                'md': '16px',
                'lg': '20px',
                'xl': '24px',
                '2xl': '28px',
                'pill': '999px',
            },
            spacing: {
                'xxs': '4px',
                'xs': '8px',
                'sm': '12px',
                'md': '16px',
                'lg': '20px',
                'xl': '24px',
                '2xl': '32px',
                '3xl': '40px',
            },
            boxShadow: {
                'soft': '0 6px 20px rgba(0,0,0,0.3)',
                'elevated': '0 12px 32px rgba(0,0,0,0.4)',
                'glow-brand': '0 0 0 2px rgba(178,124,255,0.3), 0 10px 40px rgba(146,64,255,0.35)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(circle, #A855F7 0%, #7C3AED 45%, #0EA5E9 100%)',
                'gradient-cta': 'linear-gradient(20deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)',
                'gradient-card': 'linear-gradient(180deg, rgba(255, 60, 172, 0.06) 0%, rgba(45, 212, 255, 0.06) 100%)',
            },
            animation: {
                'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                pulse: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '.5' },
                },
            },
        },
    },
    plugins: [],
}

