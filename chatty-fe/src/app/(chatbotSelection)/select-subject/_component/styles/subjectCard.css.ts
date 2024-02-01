import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const container = recipe({
	base: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: 384,
		height: 164,
		borderRadius: 12,
		fontSize: 28,
		gap: 10,
		cursor: 'pointer',
	},
	variants: {
		selected: {
			true: {
				color: globals.color.main,
				fontWeight: 700,
				background: globals.color.main_6,
				boxShadow: '0px 2px 6px 0px rgba(255, 168, 0, 0.30)',
			},
			false: {
				color: '#999',
				fontWeight: 500,
				background: '#fff',
				boxShadow: '0px 2px 6px 0px rgba(153, 153, 153, 0.25)',
			},
		},
	},
});
