import { style, keyframes } from '@vanilla-extract/css';
import { globals } from '@/app/globals.css';

export const readyContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 30,
  alignItems: 'center',
  justifyContent: 'flex-end',
  width: '100%',
});

export const readyStatus = style({
  fontSize: 30,
  fontFamily: 'var(--bagel-font)',
  fontWeight: 400,
  WebkitTextStrokeColor: globals.color.sub,
  WebkitTextStrokeWidth: 2,
  background: `linear-gradient(180deg, #FFF 30%, ${globals.color.sub} 100%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

const blinkingText = keyframes({
  '0%': {
    opacity: 0,
  },
  '50%': {
    opacity: 1,
  },
  '100%': {
    opacity: 0,
  },
});

export const buttonText = style({
  fontSize: 30,
  fontWeight: 600,
  lineHeight: '44px',
  '@media': {
    '(max-width: 768px)': {
      fontSize: 15,
      lineHeight: '22px',
      height: 110,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
});

export const blinking = style({
  animation: `${blinkingText} 2s infinite`,
});
