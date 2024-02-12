import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  alignItems: 'center',
  width: 1240,
  height: 12,
  borderRadius: 8,
  backgroundColor: globals.color.main_6,
  marginTop: 46,
  marginBottom: 230,
});

export const progress = style({
  width: 600,
  height: 12,
  backgroundColor: 'transparent',
});

export const progressActive = style({
  width: 600,
  height: 12,
  backgroundColor: globals.color.main_4,
});

export const active = style({
  fill: globals.color.main_2,
});
