/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			maxWidth: {
        152: '38rem',
        164: '41rem',
        208: '52rem',
      },
		},
	},
	plugins: [require('@tailwindcss/typography')],
}
