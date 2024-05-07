import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const mypageContainer = style({
  display: 'flex',
  maxWidth: 1124,
  width: '100%',
  height: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  overflowY: 'scroll',
  '::-webkit-scrollbar': {
    display: 'none',
  },
  scrollbarWidth: 'none',
  '@media': {
    '(max-width: 768px)': {
      height: 'calc(100% - 35px)',
      padding: 8,
    },
  },
});

export const contentContainer = style({
  display: 'flex',
  width: '100%',
  gap: 30,
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: 90,
});

export const headerText = style({
  width: '100%',
  textAlign: 'start',
  fontSize: 30,
  fontWeight: 600,
});

export const contentBox = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 20,
  border: `1px solid ${globals.color.blue_5}`,
});
