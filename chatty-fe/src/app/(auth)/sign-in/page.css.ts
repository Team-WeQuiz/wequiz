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

export const imageBox = style({
  width: 360,
  height: 167,
  marginBottom: 60,
});

export const inputFieldWrapper = style({
  width: 360,
});

export const formWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  justifyContent: 'space-between',
});

export const buttonWrapper = style({
  width: 360,
  margin: '24px 0',
});

export const link = style({
  color: 'black',
  ':hover': {
    color: globals.color.blue_main,
  },
});

export const line = style({
  flex: 1,
  height: 1,
  width: 162.5,
  backgroundColor: globals.color.black_5,
});

export const orContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 20,
});

export const orText = style({
  color: globals.color.black_5,
  padding: '0 10px',
});

export const socialWrapper = style({
  display: 'flex',
  width: 360,
  justifyContent: 'center',
  alignItems: 'center',
  gap: 16,
});

export const socialButton = style({
  border: 'none',
  cursor: 'pointer',
});
