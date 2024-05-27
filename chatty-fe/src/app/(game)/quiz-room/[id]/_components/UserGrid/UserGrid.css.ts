import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const Container = style({
  display: 'flex',
  width: 434,
  height: 516,
  alignItems: 'flex-start',
  padding: '0 14.5px',
  gap: 14.5,
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

export const MyImage = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 180,
  height: 180,
  borderRadius: 100,
  overflow: 'hidden',
  background: '#fff',
  border: `4px solid transparent`,
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
});

export const SolvedMyImage = style([
  MyImage,
  {
    border: `4px solid ${globals.color.blue_main}`,
  },
]);

export const UserImage = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 120,
  height: 120,
  borderRadius: 100,
  overflow: 'hidden',
  background: '#fff',
  border: `4px solid transparent`,
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
});

export const SolvedUserImage = style([
  UserImage,
  {
    border: `4px solid ${globals.color.blue_main}`,
  },
]);

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
