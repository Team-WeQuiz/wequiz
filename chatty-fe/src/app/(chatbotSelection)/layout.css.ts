import { keyframes, style } from '@vanilla-extract/css';
import { globals } from '../globals.css';

const fadeInOut = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

export const container = style({
  maxWidth: 1920,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: 'auto',
  animation: `${fadeInOut} 200ms ease-in-out`,
});

export const progressBar = style({
  width: 1200,
  height: 12,
  borderRadius: 8,
  background: globals.color.main_6,
  marginTop: 46,
  marginBottom: 230,
});

export const progress = style({
  width: 384,
  height: 12,
  borderRadius: '8px 0px 0px 8px',
  background: globals.color.main_4,
});

export const headerWrapper = style({
  width: 1200,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 112,
});

export const backBtnWrapper = style({
  cursor: 'pointer',
  width: 52,
  height: 52,
});

export const title = style({
  color: globals.fontColor.main,
  fontSize: 48,
  fontWeight: 700,
  margin: 0,
  padding: 0,
});
