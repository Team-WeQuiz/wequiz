import { style } from '@vanilla-extract/css';

export const Container = style({
  display: 'flex',
  width: 434,
  height: 516,
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  alignContent: 'flex-start',
  rowGap: 42,
  flexShrink: 0,
  flexWrap: 'wrap',
});

export const UserImage = style({
  width: 120,
  height: 120,
  borderRadius: 100,
  overflow: 'hidden',
  background: '#fff',
});

export const UserBox = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 8,
});
