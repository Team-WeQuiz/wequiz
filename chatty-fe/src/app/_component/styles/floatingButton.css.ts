import { style } from '@vanilla-extract/css';
import { globals } from '../../globals.css';

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
});
