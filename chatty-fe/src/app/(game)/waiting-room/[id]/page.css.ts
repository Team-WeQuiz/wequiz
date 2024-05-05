import { style } from '@vanilla-extract/css';

export const roomContainer = style({
  display: 'flex',
  width: '100%',
  maxWidth: 1830,
  gap: 30,
  height: '100%',
  '@media': {
    '(max-width: 768px)': {
      position: 'relative',
      flexDirection: 'column',
    },
  },
});

export const wideArea = style({
  maxWidth: 1314,
  width: 'calc(73% - 15px)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 30,
  '@media': {
    '(max-width: 768px)': {
      maxWidth: 768,
      width: '100%',
      position: 'absolute',
      top: 170,
      left: 0,
      zIndex: 10,
      height: 'calc(100% - 170px)',
    },
  },
});

export const narrowArea = style({
  maxWidth: 486,
  width: 'calc(28% - 15px)',
  display: 'flex',
  position: 'relative',
  height: '100%',
  '@media': {
    '(max-width: 768px)': {
      maxWidth: 768,
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 10,
      height: 160,
    },
  },
});

export const userList = style({
  width: '100%',
  height: 'calc(100% - 80px)',
});

export const chattingArea = style({
  width: '100%',
  height: 80,
  alignItems: 'center',
});

export const detailArea = style({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  width: '100%',
  height: '100%',
  top: 0,
  '@media': {
    '(max-width: 768px)': {
      width: 'calc(100% - 85px)',
      flexDirection: 'row',
      gap: 10,
    },
  },
});

export const buttonWrapper = style({
  position: 'absolute',
  display: 'flex',
  width: '100%',
  bottom: 0,
  '@media': {
    '(max-width: 768px)': {
      position: 'absolute',
      right: 0,
      width: 80,
      padding: 5,
    },
  },
});
