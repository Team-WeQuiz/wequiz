import { globalStyle, style } from '@vanilla-extract/css';
import { globals } from './globals.css';

export const container = style({
	display: 'flex',
	flexDirection: 'column',
	maxWidth: 1920,
	margin: 'auto',
	alignItems: 'center',
});

export const banner = style({
	width: '100%',
	height: 400,
	flexShrink: 0,
	backgroundColor: '#f7f7f7',
});

export const descriptionWrapper = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	padding: '110px 0',
	marginBottom: 270,
});

export const cardWrapper = style({
	display: 'flex',
	justifyContent: 'space-between',
	gap: 24,
	marginBottom: 270,
});

globalStyle(`${descriptionWrapper} h1`, {
	fontSize: 48,
	fontWeight: 500,
});

globalStyle(`${descriptionWrapper} p`, {
	fontSize: 16,
	fontWeight: 500,
});
