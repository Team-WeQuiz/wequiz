import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const mainContainer = style({
  height: '100vh',
  backgroundColor: globals.color.blue_7,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export const title = style({
  color: globals.color.black,
  fontSize: 30,
  fontWeight: 600,
  marginBottom: 40,
});

export const inputFieldContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  alignItems: 'center',
  marginBottom: 80,
});

export const inputFieldWrapper = style({
  width: 360,
});

export const buttonWrapper = style({
  width: 360,
});

export const misMatchMessage = style({
  color: globals.color.red,
  height: 20,
  marginTop: 5,
  fontSize: 14,
});
