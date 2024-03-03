import { style, keyframes } from '@vanilla-extract/css';
import { globals } from '@/app/globals.css';

export const card = style({
  width: '100%',
  height: 352,
});

export const activeCardShadow = style({
  boxShadow: '0px 2px 6px 0px rgba(255, 168, 0, 0.25)',
});

export const titleContainer = style({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  padding: 6,
  justifyContent: 'space-between',
  backgroundColor: globals.color.white,
  borderRadius: 10,
});

export const title = style({
  fontSize: 18,
  fontWeight: 700,
  color: globals.color.black,
  lineHeight: 'normal',
});

export const tagContainer = style({
  display: 'flex',
  gap: 10,
});

// loading card
export const loadingCard = style({
  backgroundColor: '#fff',
});

export const loadingContainer = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 5,
});

const blink = keyframes({
  '0%': { opacity: 1 },
  '50%': { opacity: 0.2 },
  '100%': { opacity: 1 },
});

export const loadingText = style({
  color: globals.color.black_5,
  fontSize: 16,
  fontWeight: 500,
  animation: `${blink} 1.5s linear infinite`,
});

export const circularContainer = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 72,
  height: 72,
});

export const activeCard = style({
  backgroundColor: globals.color.main_7,
});

// active card
export const cardContent = style({
  width: '100%',
  position: 'absolute',
  left: 0,
  bottom: 128,
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
  alignItems: 'center',
  justifyContent: 'center',
});

export const contentText = style({
  fontSize: 16,
  fontWeight: 500,
  color: globals.color.main,
});

export const buttonArea = style({
  display: 'flex',
  position: 'absolute',
  left: 0,
  bottom: 55,
  width: '100%',
  justifyContent: 'center',
});

export const buttonText = style({
  color: globals.color.white,
  fontSize: 18,
  fontWeight: 700,
  padding: '5px 30px',
});
