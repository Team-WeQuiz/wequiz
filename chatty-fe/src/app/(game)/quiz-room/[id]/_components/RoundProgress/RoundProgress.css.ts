import { style } from '@vanilla-extract/css';

export const Container = style({
  display: 'flex',
  gap: 10,
  width: '100%',
  justifyContent: 'space-between',
});

export const ImageWrapper = style({
  width: '100%',
  height: 20,
  position: 'relative',
});
