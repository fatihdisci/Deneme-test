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
                    950: '#020617', // Deep background
                },
                gold: {
                    DEFAULT: '#c5a059',
                    500: '#c5a059', // Legal gold
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'Georgia', 'serif'],
            }
        },
    },
    plugins: [typography],
}
