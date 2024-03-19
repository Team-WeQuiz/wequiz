import { style } from '@vanilla-extract/css';
import { globals } from '../../../globals.css';

export const gameListContainer = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  padding: 24,
  alignItems: 'center',
  backgroundColor: globals.color.blue_main,
  borderRadius: 26,
  position: 'relative',
});

export const gameListGrid = style({
  display: 'grid',
  gap: '24px',
  width: '100%',
  height: 'calc(100%-48px)',
  gridTemplateColumns:
    'repeat(auto-fill, minmax(calc((100% - 48px - 24px) / 2), 1fr))',
  '@media': {
    '(max-width: 554px)': {
      gridTemplateColumns: 'repeat(auto-fill, minmax(calc(100% - 48px), 1fr))',
    },
  },
  paddingTop: 4,
  paddingBottom: 4,
  paddingRight: 24,
  marginRight: -4,
  overflowY: 'scroll',
  '::-webkit-scrollbar': {
    position: 'absolute',
    right: 0,
    width: 20,
    boxShadow: '0px 0px 4px 0px rgba(17, 41, 66, 0.25) inset',
    borderRadius: 12,
    height: 'calc(100% - 48px)',
  },
  '::-webkit-scrollbar-thumb': {
    width: 24,
    backgroundColor: globals.color.blue_7,
    borderRadius: 12,
    boxShadow: '0px 0px 4px 2px rgba(23, 96, 171, 0.25)',
  },
});
