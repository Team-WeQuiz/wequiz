import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const quizListContainer = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '24px 24px 60px 24px',
  alignItems: 'center',
});

export const quizListGrid = style({
  display: 'grid',
  gap: '24px',
  width: '100%',
  overflowY: 'scroll',
  padding: 4,
  gridTemplateColumns:
    'repeat(auto-fill, minmax(calc((100% - 48px - 24px) / 2), 1fr))',
  '@media': {
    '(max-width: 554px)': {
      gridTemplateColumns: 'repeat(auto-fill, minmax(calc(100% - 48px), 1fr))',
    },
  },
});

export const paginatorWrapper = style({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  height: 60,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const quizCard = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: 10,
  gap: 10,
  backgroundColor: globals.color.blue_7,
  borderRadius: 16,
  boxShadow: '0 2px 8px 2px rgba(153, 153, 153, 0.20)',
});

export const quizTitle = style({
  width: '100%',
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  fontWeight: '600',
  backgroundColor: globals.color.blue_6,
  padding: 10,
  borderRadius: 12,
});

export const quizDescription = style({
  width: '100%',
  color: globals.color.black_2,
  fontWeight: '400',
  padding: '0 10px',
});
