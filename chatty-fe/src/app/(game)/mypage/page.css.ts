import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const mypageContainer = style({
  display: 'flex',
  maxWidth: 1124,
  width: '100%',
  flexDirection: 'column',
  '@media': {
    '(max-width: 768px)': {
      height: 'calc(100% - 35px)',
      padding: 8,
    },
  },
});

export const mobileTab = style({
  display: 'none',
  '@media': {
    '(max-width: 768px)': {
      position: 'sticky',
      top: -8,
      display: 'flex',
      width: '100%',
      gap: 10,
      paddingBottom: 10,
      backgroundColor: '#fff',
      zIndex: 10,
    },
  },
});

export const tabText = style({
  fontSize: 16,
  fontWeight: 400,
  padding: '8px 4px',
  color: globals.color.black_2,
  cursor: 'pointer',
});

export const tabTextActive = style({
  fontSize: 16,
  fontWeight: 600,
  color: globals.color.black,
});

export const contentContainer = style({
  display: 'flex',
  width: '100%',
  gap: 30,
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: 90,
});

export const mobileHidden = style({
  '@media': {
    '(max-width: 768px)': {
      display: 'none',
    },
  },
});

export const headerText = style({
  width: '100%',
  textAlign: 'start',
  fontSize: 30,
  fontWeight: 600,
  '@media': {
    '(max-width: 768px)': {
      display: 'none',
    },
  },
});

export const contentBox = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 20,
  border: `1px solid ${globals.color.blue_5}`,
});
