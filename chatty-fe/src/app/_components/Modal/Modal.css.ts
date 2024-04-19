import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const modalBackdrop = style({
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const modalContainer = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: 750,
  height: 400,
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 20,
  zIndex: 3001,
  '@media': {
    '(max-width: 768px)': {
      width: '90%',
    },
  },
});

export const closeButtonWrapper = style({
  position: 'absolute',
  top: 8,
  right: 8,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 36,
  height: 36,
  backgroundColor: '#fff',
});

export const closeButton = style({
  width: 32,
  height: 32,
  display: 'flex',
  padding: 0,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 16,
  backgroundColor: globals.color.blue_5,
  color: globals.color.blue_main,
  fontSize: 16,
  fontWeight: '400',
});
