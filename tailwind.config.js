/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte}'],
	theme: {
		extend: {
			colors: {
				ink: '#111111',
				paper: '#FFFFFF',
				surface: '#F7F7F8',
				muted: '#6B7280',
				border: '#E7E7EA',
				heart: {
					DEFAULT: '#E11D2E',
					dark: '#B4141F',
					light: '#FCE4E6'
				},
				quick: {
					DEFAULT: '#16A34A',
					light: '#E9F9EF'
				},
				detailed: {
					DEFAULT: '#D97706',
					light: '#FDF3E3'
				}
			},
			fontFamily: {
				display: ['Poppins', 'sans-serif'],
				body: ['Inter', 'sans-serif']
			},
			borderRadius: {
				xl2: '1.25rem'
			},
			boxShadow: {
				soft: '0 8px 30px -12px rgba(17, 17, 17, 0.12)',
				card: '0 2px 10px -4px rgba(17, 17, 17, 0.08)'
			},
			keyframes: {
				heartbeat: {
					'0%, 100%': { transform: 'scale(1)' },
					'14%': { transform: 'scale(1.15)' },
					'28%': { transform: 'scale(1)' },
					'42%': { transform: 'scale(1.12)' },
					'70%': { transform: 'scale(1)' }
				},
				'slide-in': {
					from: { opacity: 0, transform: 'translateX(16px)' },
					to: { opacity: 1, transform: 'translateX(0)' }
				},
				'fade-up': {
					from: { opacity: 0, transform: 'translateY(8px)' },
					to: { opacity: 1, transform: 'translateY(0)' }
				}
			},
			animation: {
				heartbeat: 'heartbeat 1.8s ease-in-out infinite',
				'slide-in': 'slide-in 0.28s ease-out',
				'fade-up': 'fade-up 0.24s ease-out'
			}
		}
	},
	plugins: []
};
