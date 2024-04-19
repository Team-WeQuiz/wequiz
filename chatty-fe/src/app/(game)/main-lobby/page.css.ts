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

export const searchInput = style({
  width: 360,
});

export const createButton = style({
  width: 168,
});
