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
			animation: {
				'fade-in': 'fadeIn 1s ease-in',
			},
			"fade-in": {
    		"0%": {
      	"opacity": "0"
    		},
    		"100%": {
    	  "opacity": "1"
    		}
		  },
		},
	},
	plugins: [require('@tailwindcss/typography')],
}
