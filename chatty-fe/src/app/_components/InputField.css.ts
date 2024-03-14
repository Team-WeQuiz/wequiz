import { style } from '@vanilla-extract/css';
import { globals } from '../globals.css';

export const container = style({
  display: 'flex',
  height: 60,
  padding: '20px 12px',
  alignItems: 'center',
  gap: 10,
  borderRadius: 12,
  border: `1px solid ${globals.color.black_6}`,
});

export const small = style({
  width: 360,
});

export const medium = style({
  width: 404,
});

export const large = style({
  width: 956,
});
