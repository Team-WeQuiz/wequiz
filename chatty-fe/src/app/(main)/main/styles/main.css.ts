import { globalStyle, style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: 1920,
  margin: 'auto',
  alignItems: 'center',
});

export const banner = style({
  width: '100vw',
  height: 'calc(100vw - 112px)',
  backgroundColor: 'black',
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

export const chattySection = style({
  width: '100%',
  height: 949,
  background:
    'linear-gradient(180deg, #FFA800 0%, rgba(255, 168, 0, 0.00) 100%)',
});
