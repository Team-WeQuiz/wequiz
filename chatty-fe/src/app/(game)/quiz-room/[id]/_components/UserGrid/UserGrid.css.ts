import { globals } from '@/app/globals.css';
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

export const UserContainer = style({
  display: 'flex',
  flexDirection: 'column',
  padding: 12,
  width: 458,
  height: 902,
  borderRadius: 20,
  background: globals.color.blue_6,
  gap: 30,
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

export const MyContainer = style({
  width: 434,
  height: 360,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fff',
  gap: 10,
});

export const MyNickname = style({
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
