import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                slate: {
                    950: '#020617', // Deep background
                },
                gold: {
                    500: '#D4AF37', // Branding gold
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [typography],
}
