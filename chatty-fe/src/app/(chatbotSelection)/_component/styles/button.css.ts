import { globals } from '@/app/globals.css';
import { recipe } from '@vanilla-extract/recipes';

export const button = recipe({
	base: {
		marginTop: 192,
		display: 'flex',
		width: '384px',
		padding: '20px 20px',
		border: 'none',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 36,
		color: '#fff',
		fontSize: 28,
		transition: ' box-shadow 0.3s ease-in-out, transform 0.2s ease',
		':hover': {
			boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
		},
		':active': {
			transform: 'scale(0.98)',
		},
	},
	variants: {
		selected: {
			true: {
				background: globals.color.main,
				boxShadow: '0px 4px 15px 0px rgba(0, 0, 0, 0.00);',
				cursor: 'pointer',
			},
			false: {
				background: '#e6e6e6',
				boxShadow: '0px 4px 15px 0px rgba(0, 0, 0, 0.00);',
			},
		},
	},
});
