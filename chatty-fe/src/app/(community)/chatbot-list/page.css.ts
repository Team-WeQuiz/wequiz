import { style } from '@vanilla-extract/css';

export const gridContainer = style({
  display: 'grid',
  gap: '24px',
  width: '100%',
  maxWidth: 1248,
  padding: '0 24px',
  gridTemplateColumns:
    'repeat(auto-fill, minmax(calc((100% - 48px - 24px) / 3), 1fr))',
  '@media': {
    '(max-width: 840px)': {
      gridTemplateColumns:
        'repeat(auto-fill, minmax(calc((100% - 48px - 24px) / 2), 1fr))',
    },
    '(max-width: 580px)': {
      gridTemplateColumns: 'repeat(auto-fill, minmax(calc(100% - 48px), 1fr))',
    },
  },
});
