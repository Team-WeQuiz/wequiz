import { style, keyframes } from '@vanilla-extract/css';
import { globals } from '@/app/globals.css';

export const sparklesContainer = style({
  position: 'absolute',
  width: 1300,
  height: 900,
});

export const sparklesWrapper = style({
  position: 'relative',
  width: '100%',
  height: '100%',
  marginBottom: 40,
});

const sparkleMotion = keyframes({
  '0%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.1)' },
  '100%': { transform: 'scale(1)' },
});

export const sparkles = style({
  position: 'absolute',
  width: 20,
  height: 20,
  transition: 'top 1s, left 1s',
  filter: 'drop-shadow(0 0 5px #fff)',
  animation: `${sparkleMotion} 1s ease-in-out infinite`,
});

export const dropShadow = style({
  filter: `drop-shadow(0 0 5px ${globals.color.blue_main})`,
});
