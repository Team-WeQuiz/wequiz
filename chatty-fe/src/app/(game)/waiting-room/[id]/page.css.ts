import { style, keyframes } from '@vanilla-extract/css';
import { globals } from '@/app/globals.css';

export const roomContainer = style({
  display: 'flex',
  width: '100%',
  maxWidth: 1830,
  gap: 30,
  height: '100%',
  position: 'relative',
  '@media': {
    '(max-width: 768px)': {
      position: 'relative',
      flexDirection: 'column',
    },
  },
});

export const wideArea = style({
  maxWidth: 1314,
  width: 'calc(73% - 15px)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 30,
  '@media': {
    '(max-width: 768px)': {
      maxWidth: 768,
      width: '100%',
      position: 'absolute',
      gap: 12,
      top: 170,
      left: 0,
      zIndex: 10,
      height: 'calc(100% - 170px)',
    },
  },
});

export const narrowArea = style({
  maxWidth: 486,
  width: 'calc(28% - 15px)',
  display: 'flex',
  position: 'relative',
  height: '100%',
  '@media': {
    '(max-width: 768px)': {
      maxWidth: 768,
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 10,
      height: 160,
    },
  },
});

export const userList = style({
  width: '100%',
  height: 'calc(100% - 80px)',
});

export const chattingArea = style({
  width: '100%',
  height: 80,
  alignItems: 'center',
});

export const detailArea = style({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  width: '100%',
  height: '100%',
  top: 0,
  '@media': {
    '(max-width: 768px)': {
      width: 'calc(100% - 85px)',
      flexDirection: 'row',
      gap: 10,
    },
  },
});

export const buttonWrapper = style({
  position: 'absolute',
  display: 'flex',
  width: '100%',
  bottom: 0,
  '@media': {
    '(max-width: 768px)': {
      position: 'absolute',
      right: 0,
      width: 80,
      height: '100%',
    },
  },
});

export const readyStatus = style({
  position: 'absolute',
  top: 'calc(40% - 15px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: 120,
  background:
    'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.4) 15%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.4) 85%, rgba(255,255,255,0.2) 100%)',
  zIndex: 10,
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
export const blinking = style({
  animation: `${blinkingText} 2s infinite`,
});

export const readyStatusText = style({
  fontSize: 38,
  fontFamily: 'var(--bagel-font)',
  fontWeight: 400,
  WebkitTextStrokeColor: globals.color.sub,
  WebkitTextStrokeWidth: 2,
  background: `linear-gradient(180deg, #FFF 30%, ${globals.color.sub} 100%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});
