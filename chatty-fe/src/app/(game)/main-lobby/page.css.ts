import { style } from '@vanilla-extract/css';

export const lobbyContainer = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  overflowY: 'hidden',
});

export const centerContainer = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  maxWidth: 1124,
  padding: '0 20px',
  gap: 30,
});

export const toolBar = style({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  gap: 30,
});

export const codeInput = style({
  width: 300,
  padding: 1,
});

export const createButton = style({
  width: 168,
  maxHeight: 60,
  padding: 1,
});

export const buttonText = style({
  fontSize: 20,
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: 14,
    },
  },
});
