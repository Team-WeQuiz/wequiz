import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

// export const container = style({
// 	display: 'flex',
// 	width: 1200,
// 	height: 352,
// 	padding: '8px 16px',
// 	flexDirection: 'column',
// 	justifyContent: 'center',
// 	alignItems: 'center',
// 	borderRadius: 12,
// 	border: '2px dashed #e6e6e6',
// 	backgroundColor: '#fff',
// 	boxShadow: '0px 2px 6px 0px rgba(153, 153, 153, 0.25)',
// });

export const container = recipe({
	base: {
		display: 'flex',
		width: 1200,
		height: 352,
		padding: '8px 16px',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 12,
		border: '2px dashed #e6e6e6',
		backgroundColor: '#fff',
		boxShadow: '0px 2px 6px 0px rgba(153, 153, 153, 0.25)',
	},
	variants: {
		isUploaded: {
			true: {
				border: `2px dashed ${globals.color.main_5}`,
				color: globals.color.main,
				fontSize: 48,
			},
		},
	},
});

export const wrapper = style({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	gap: 40,
});

export const ddWrapper = style({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	gap: 10,
	color: '#999',
	fontSize: 16,
	fontWeight: 500,
});
