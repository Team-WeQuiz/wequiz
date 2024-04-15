// styles.css.ts
import { style, keyframes } from '@vanilla-extract/css';
import { globals } from './globals.css';

export const container = style({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: globals.color.blue_5,
  overflow: 'hidden',
});

export const centerContainer = style({
  width: '100%',
  height: '100%',
  maxWidth: 1300,
  maxHeight: 1300,
  position: 'relative',
});

const rotateAnimation = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

export const glow = style({
  position: 'absolute',
  width: 1300,
  height: 1300,
  top: 'calc(50% - 750px)',
  left: 'calc(50% - 650px)',
  borderRadius: '50%',
  background: 'radial-gradient(circle, #fff 0%, transparent 40%)',
  WebkitMask: `repeating-conic-gradient(#000 0deg 20deg, transparent 20deg 45deg)`,
  animation: `${rotateAnimation} 10s linear infinite`,
});

export const mask = style({
  position: 'absolute',
  width: 1800,
  height: 1300,
  top: 'calc(50% - 750px)',
  left: 'calc(50% - 900px)',
  background: `radial-gradient(ellipse at center, transparent 30%, ${globals.color.blue_5} 35%)`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const scaleAnimation = keyframes({
  '0%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.02)' },
  '100%': { transform: 'scale(1)' },
});

const fadeIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

export const logoWapper = style({
  display: 'flex',
  width: 600,
  height: 600,
  marginBottom: 40,
  animation: `${fadeIn} 1s ease-in, ${scaleAnimation} 2s ease-in-out infinite`,
  '@media': {
    '(max-width: 600px)': {
      width: 346,
    },
  },
});

export const buttonWrapper = style({
  position: 'absolute',
  width: 340,
  height: 100,
  top: 'calc(50% + 270px)',
  textDecoration: 'none',
});

export const buttonText = style({
  fontSize: 40,
});
