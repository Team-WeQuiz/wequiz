import { style } from '@vanilla-extract/css';
import { globals } from '@/app/globals.css';

export const button = style({
	position: 'fixed',
	bottom: '40px',
	zIndex: 9999,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: globals.color.main,
	borderRadius: 16,
	border: 'none',
	boxShadow: '0px 4px 15px 0px rgba(0, 0, 0, 0)',
	padding: '20px 200px',
	width: 589,
	cursor: 'pointer',
	fontSize: '18px',
	fontWeight: 700,
	// ':after': {
	// 	position: 'absolute',
	// 	content: '',
	// 	width: 0,
	// 	height: '100%',
	// 	top: 0,
	// 	right: 0,
	// 	zIndex: -1,
	// 	backgroundColor: globals.color.main_4,
	// 	borderRadius: 16,
	// 	transition: 'all 0.3s ease',
	// },
	// selectors: {
	// 	'&:hover:after': {
	// 		left: 0,
	// 		width: '100%',
	// 	},
	// },
});
