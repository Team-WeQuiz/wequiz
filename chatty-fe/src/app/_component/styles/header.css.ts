import { style } from '@vanilla-extract/css';
import { globals } from '@/app/globals.css';

export const header = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	width: 1200,
	padding: '36px 0',
});

export const wrapper = style({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	gap: 12,
});

export const startButton = style({
	backgroundColor: globals.color.main,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	padding: '8px 16px',
	border: 'none',
	borderRadius: 8,
	cursor: 'pointer',
});

export const logo = style({
	width: 132,
	height: 40,
});
