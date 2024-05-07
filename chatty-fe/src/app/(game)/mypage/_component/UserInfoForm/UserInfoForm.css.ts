import { style } from '@vanilla-extract/css';
import { globals } from '@/app/globals.css';

export const infoContainer = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '30px 16px',
  gap: 40,
});

export const infoWrapper = style({
  width: '100%',
  maxWidth: 360,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

export const buttonWrapper = style({
  width: '100%',
  marginTop: 10,
});

export const misMatchMessage = style({
  color: globals.color.red,
  height: 20,
  marginTop: 5,
  fontSize: 14,
});
