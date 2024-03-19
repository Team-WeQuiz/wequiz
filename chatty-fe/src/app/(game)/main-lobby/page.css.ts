import { style } from '@vanilla-extract/css';

export const lobbyContainer = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  paddingBottom: 100,
  alignItems: 'center',
});

export const centerContainer = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: 1084,
  padding: '52px 0',
  gap: 30,
});

export const toolBar = style({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
});

export const searchInput = style({
  width: 360,
});

export const createButton = style({
  width: 168,
});

export const gameListGrid = style({
  display: 'grid',
  gap: '24px',
  width: '100%',
  padding: '0 24px',
  borderStyle: 'solid',
  borderWidth: 1,
  gridTemplateColumns:
    'repeat(auto-fill, minmax(calc((100% - 48px - 24px) / 2), 1fr))',
  '@media': {
    '(max-width: 554px)': {
      gridTemplateColumns: 'repeat(auto-fill, minmax(calc(100% - 48px), 1fr))',
    },
  },
});
