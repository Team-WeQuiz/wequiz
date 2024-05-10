import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const CircleBase = style({
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  backgroundColor: 'transparent',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const CircleFill = style({
  borderRadius: '50%',
  position: 'absolute',
  width: '160px',
  height: '160px',
  background: globals.color.blue_6,
});

export const Percentage = style({
  zIndex: 1000,
  fontSize: 20,
  textAlign: 'center',
});
