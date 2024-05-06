import { style } from '@vanilla-extract/css';
import { globals } from '@/app/globals.css';

export const infoCard = style({
  width: '100%',
  height: 280,
  padding: 12,
  borderRadius: 20,
  backgroundColor: globals.color.blue_6,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '@media': {
    '(max-width: 768px)': {
      width: 'calc(50% - 5px)',
      height: 'auto',
    },
  },
});

export const header = style({
  position: 'relative',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 44,
  '@media': {
    '(max-width: 768px)': {
      marginTop: 0,
    },
  },
});

export const decoIcon = style({
  position: 'absolute',
  top: -50,
  left: 0,
  '@media': {
    '(max-width: 768px)': {
      display: 'none',
    },
  },
});

export const name = style({
  width: '100%',
  textAlign: 'center',
  backgroundColor: globals.color.blue_main,
  borderRadius: 16,
  padding: '12px 8px 12px 24px',
  fontSize: 20,
  fontWeight: 600,
  color: 'white',
  '@media': {
    '(max-width: 768px)': {
      fontSize: 10,
      padding: '6px',
    },
  },
});

export const nameText = style({
  position: 'relative',
  zIndex: 1,
  '@media': {
    '(max-width: 768px)': {
      fontSize: 12,
    },
  },
});

export const textEllipsis = style({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const description = style({
  width: '100%',
  display: 'flex',
  minHeight: 110,
  padding: '16px 12px',
  justifyContent: 'flex-start',
  color: globals.color.black_3,
  fontSize: 16,
  fontWeight: 400,
  '@media': {
    '(max-width: 768px)': {
      minHeight: 0,
      maxHeight: 120,
      overflowY: 'scroll',
    },
  },
});

export const descriptionText = style({
  '@media': {
    '(max-width: 768px)': {
      justifyContent: 'center',
      fontSize: 12,
    },
  },
});

export const detail = style({
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
});

export const detailBlock = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  padding: '12px 0',
  color: globals.color.black,
  fontSize: 20,
  fontWeight: 400,
  backgroundColor: globals.color.blue_7,
  borderRadius: 16,
  '@media': {
    '(max-width: 768px)': {
      fontSize: 10,
    },
  },
});

export const detailText = style({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  verticalAlign: 'bottom',
  '@media': {
    '(max-width: 768px)': {
      width: '100%',
      justifyContent: 'center',
    },
  },
});

export const mobileHidden = style({
  '@media': {
    '(max-width: 768px)': {
      display: 'none',
    },
  },
});

export const numText = style({
  display: 'flex',
  alignItems: 'center',
  fontSize: 24,
  fontFamily: 'var(--bagel-font)',
  lineHeight: 1.2,
  '@media': {
    '(max-width: 768px)': {
      fontSize: 12,
    },
  },
});
