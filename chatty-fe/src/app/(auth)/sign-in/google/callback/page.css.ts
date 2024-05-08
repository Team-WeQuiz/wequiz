import { globals } from '@/app/globals.css';
import { keyframes, style } from '@vanilla-extract/css';

export const Container = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  gap: 20,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: globals.color.blue_6,
});

export const Logo = style({
  width: 400,
  height: 400,
});

const Blink = keyframes({
  '0%': {
    opacity: 0,
  },
  '25%': {
    opacity: 0.5,
  },
  '50%': {
    opacity: 1,
  },
  '75%': {
    opacity: 0.5,
  },
  '100%': {
    opacity: 0,
  },
});

export const Description = style({
  fontSize: 30,
  fontWeight: 700,
  color: globals.color.blue_main,
  animation: `${Blink} 2s linear infinite`,
});
