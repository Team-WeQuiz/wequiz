import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const UserContainer = style({
  display: 'flex',
  flexDirection: 'column',
  padding: 12,
  width: '100%',
  height: '100%',
  borderRadius: 20,
  background: globals.color.blue_6,
  gap: 30,
  '@media': {
    '(max-width: 768px)': {
      flexDirection: 'row',
      gap: 8,
    },
  },
});

export const MyImage = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  overflow: 'hidden',
  background: '#fff',
  border: `5px solid transparent`,
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
  maxWidth: 160,
  maxHeight: 160,
  '@media': {
    '(max-width: 768px)': {
      maxWidth: 45,
      maxHeight: 45,
    },
  },
});

export const SolvedMyImage = style([
  MyImage,
  {
    border: `5px solid ${globals.color.blue_2}`,
    '@media': {
      '(max-width: 768px)': {
        border: `3px solid ${globals.color.blue_2}`,
      },
    },
  },
]);

export const MyContainer = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fff',
  gap: 10,
  padding: '20px 12px',
  borderRadius: 16,
  '@media': {
    '(max-width: 768px)': {
      justifyContent: 'flex-end',
      width: 100,
      padding: '3px 5px',
      gap: 2,
    },
  },
});

export const MyNickname = style({
  fontSize: 20,
  '@media': {
    '(max-width: 768px)': {
      display: 'none',
    },
  },
});

export const EmojiContainer = style({
  display: 'flex',
  gap: 10,
  alignItems: 'center',
  justifyContent: 'center',
  '@media': {
    '(max-width: 768px)': {
      gap: 3,
      transform: 'scale(0.5)',
    },
  },
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

export const Container = style({
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  height: '100%',
  alignContent: 'flex-start',
  alignItems: 'flex-start',
  padding: '0 12px',
  gap: 12,
  flexShrink: 0,
  '@media': {
    '(max-width: 768px)': {
      width: 'calc(100% - 108px)',
      gap: 4,
      padding: 0,
      alignContent: 'space-around',
      overflowX: 'auto',
    },
  },
});

export const UserImage = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  overflow: 'hidden',
  background: '#fff',
  border: `5px solid transparent`,
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
  '@media': {
    '(max-width: 768px)': {
      maxWidth: 40,
      maxHeight: 40,
    },
  },
});

export const SolvedUserImage = style([
  UserImage,
  {
    border: `5px solid ${globals.color.blue_2}`,
    '@media': {
      '(max-width: 768px)': {
        border: `3px solid ${globals.color.blue_2}`,
      },
    },
  },
]);

export const UserBox = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 8,
});

export const UserNickname = style({
  '@media': {
    '(max-width: 768px)': {
      display: 'none',
    },
  },
});
