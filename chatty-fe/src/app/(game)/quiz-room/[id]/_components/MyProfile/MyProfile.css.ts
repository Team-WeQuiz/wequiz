import { style } from '@vanilla-extract/css';

export const Container = style({
  width: 434,
  height: 360,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fff',
  gap: 10,
});

export const Nickname = style({
  fontSize: 20,
});

export const EmojiContainer = style({
  display: 'flex',
  gap: 10,
  alignItems: 'center',
  justifyContent: 'center',
});

export const EmojiWrapper = style({
  width: 32,
  height: 32,
  borderRadius: '50%',
  background: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',
  cursor: 'pointer',
});
