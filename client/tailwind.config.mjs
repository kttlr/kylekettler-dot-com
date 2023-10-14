/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				clash: ['ClashGrotesk-Regular', 'sans-serif'],
				clashLight: ['ClashGrotesk-Light', 'sans-serif'],
				switzerBold: ['Switzer-Bold', 'sans-serif'],
			},
			maxWidth: {
        152: '38rem',
        164: '41rem',
        208: '52rem',
      },
		},
	},
	plugins: [],
}
