import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '100%',
  gap: 76,
  height: '100%',
  alignItems: 'center',
  borderTop: '1px solid #e0e0e0',
});

export const pageContainer = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  paddingBottom: 100,
  justifyContent: 'center',
});
