import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                navy: '#0f172a',
                anthracite: '#334155',
                slate: {
                    DEFAULT: '#020617',
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617', // Deep background
                },
                // CUSTOM GOLD PALETTE (Replaces Amber/Orange)
                gold: {
                    50: '#fbf7ef',
                    100: '#f5edd8',
                    200: '#ead9b0',
                    300: '#dec084',
                    400: '#cca762', // Highlight
                    500: '#ab934d', // MAIN BRAND COLOR (Base)
                    600: '#96793f', // Hover
                    700: '#7a6034',
                    800: '#654f2e',
                    900: '#544129',
                    950: '#2e2315',
                    DEFAULT: '#ab934d',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
        },
    },
    plugins: [typography],
}

