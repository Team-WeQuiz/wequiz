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
  width: 750,
  height: 400,
  backgroundColor: 'white',
  borderRadius: 5,
  paddingTop: 5,
  paddingLeft: 5,
  paddingRight: 5,
  paddingBottom: 24,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  zIndex: 3001,
  '@media': {
    '(max-width: 768px)': {
      width: '90%',
    },
  },
});

export const modalHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 24,
});

export const empty = style({
  width: 35,
  height: 35,
});

export const modalContent = style({
  overflowY: 'auto',
  width: '100%',
  maxHeight: 400,
  padding: 24,
});

export const modalFooter = style({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
});

export const confirmButtonText = style({
  fontSize: 16,
  fontWeight: 600,
});