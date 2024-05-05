import { keyframes, style } from '@vanilla-extract/css';
import { globals } from '@/app/globals.css';

const blinking = keyframes({
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

export const blinkingText = style({
  animation: `${blinking} 2s infinite`,
});

export const summaryCard = style({
  width: '100%',
  padding: 12,
  borderRadius: 20,
  backgroundColor: globals.color.blue_6,
  height: 'calc(100% - 410px)',
  '@media': {
    '(max-width: 768px)': {
      width: 'calc(50% - 5px)',
      height: '100%',
    },
  },
});

export const header = style({
  padding: 14,
  '@media': {
    '(max-width: 768px)': {
      padding: 8,
    },
  },
});

export const summaryTextContainer = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  padding: 14,
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  lineHeight: 1.5,
  height: 'calc(100% - 47px)',
  overflowY: 'scroll',
  position: 'relative',
  // hide scroll bar
  '::-webkit-scrollbar': {
    display: 'none',
  },
  scrollbarWidth: 'none',
  '@media': {
    '(max-width: 768px)': {
      padding: 8,
    },
  },
});
