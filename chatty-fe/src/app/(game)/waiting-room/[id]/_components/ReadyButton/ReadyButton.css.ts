import { style, keyframes } from '@vanilla-extract/css';
import { globals } from '@/app/globals.css';

export const readyContainer = style({
  display: 'flex',
  // flexDirection: 'column',
  gap: 12,
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  overflow: 'visible',
  '@media': {
    '(max-width: 768px)': {
      padding: 4,
      flexDirection: 'column',
      overflow: 'clip',
      height: '100%',
      gap: 5,
    },
  },
});

export const readyButtonWrapper = style({
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
  fontSize: 28,
  fontWeight: 600,
  lineHeight: '44px',
  minWidth: 70,
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  '@media': {
    // '(max-width: '
    '(max-width: 768px)': {
      fontSize: 15,
      lineHeight: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
});

export const blinking = style({
  animation: `${blinkingText} 2s infinite`,
});

export const shareButton = style({
  height: 44,
  '@media': {
    '(max-width: 768px)': {
      height: 20,
    },
  },
});

export const modalContent = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0 40px',
});

export const titleContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 435,
  marginBottom: 32,
  '@media': {
    '(max-width: 768px)': {
      width: '100%',
    },
  },
});

export const titleWrapper = style({
  width: '100%',
  textAlign: 'center',
  borderRadius: 16,
  border: `4px solid ${globals.color.blue_main}`,
  padding: 12,
  fontSize: 20,
  fontWeight: 600,
  color: globals.color.black,
  position: 'relative',
  top: -5,
});

export const textContainer = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  textAlign: 'center',
  marginBottom: 24,
  color: globals.color.red,
  fontWeight: 600,
});

export const inputWrapper = style({
  width: 240,
  '@media': {
    '(max-width: 768px)': {
      width: '100%',
    },
  },
});

export const copyButton = style({
  padding: 10,
  backgroundColor: globals.color.black_7,
  border: `1px solid ${globals.color.black_6}`,
  borderTopRightRadius: 12,
  borderBottomRightRadius: 12,
  cursor: 'pointer',
  height: 60,
});
