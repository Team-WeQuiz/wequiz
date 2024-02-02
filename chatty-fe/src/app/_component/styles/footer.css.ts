import { globalStyle, style } from '@vanilla-extract/css';

export const container = style({
	display: 'flex',
	width: '1920px',
	padding: '36px 360px',
	flexDirection: 'column',
	alignItems: 'center',
	gap: 154,
	backgroundColor: '#f7f7f7',
});

export const contentsWrapper = style({
	display: 'flex',
	width: 1200,
	gap: 70,
});

export const contentsSection = style({
	display: 'flex',
	justifyContent: 'flex-end',
	alignItems: 'flex-start',
	gap: 150,
	flex: 1,
});

export const productWrapper = style({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'flex-start',
	gap: 16,
});

export const copyright = style({
	fontSize: 16,
	fontWeight: 500,
});

globalStyle(`${productWrapper} > h1`, {
	fontSize: 16,
	fontWeight: 500,
	margin: 0,
	padding: 0,
});

globalStyle(`${productWrapper} > h2`, {
	fontSize: 16,
	fontWeight: 500,
	margin: 0,
	padding: 0,
	color: '#666',
});
