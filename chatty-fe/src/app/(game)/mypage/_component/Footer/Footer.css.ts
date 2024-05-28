import { style } from '@vanilla-extract/css';
import { globals } from '@/app/globals.css';

export const mypageFooter = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100vw',
  position: 'relative',
  transform: 'translateX(-50%)',
  left: '50%',
  backgroundColor: globals.color.blue_6,
  padding: '20px 0',
  '@media': {
    '(max-width: 768px)': {
      padding: '8px 0',
    },
  },
});

export const footerWrapper = style({
  position: 'relative',
  maxWidth: 1124,
  width: '100%',
  display: 'flex',
  padding: 32,
  '@media': {
    '(max-width: 768px)': {
      padding: 16,
    },
  },
});

export const footerLogo = style({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  '@media': {
    '(max-width: 768px)': {
      display: 'none',
    },
  },
});

export const footerLinks = style({
  width: '100%',
  position: 'relative',
  top: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 50,
  '@media': {
    '(max-width: 768px)': {
      gap: 20,
    },
  },
});

export const link = style({
  height: 'fit-content',
});

export const linkText = style({
  color: globals.color.blue_3,
  fontSize: 20,
  fontWeight: 500,
  '@media': {
    '(max-width: 768px)': {
      fontSize: 14,
    },
  },
  ':hover': {
    textDecoration: 'underline',
  },
});

export const linkIcons = style({
  display: 'flex',
  gap: 8,
  marginTop: 12,
  paddingLeft: 4,
  '@media': {
    '(max-width: 768px)': {
      marginTop: 8,
      gap: 4,
    },
  },
});

export const socialIcon = style({
  '@media': {
    '(max-width: 768px)': {
      width: 16,
      height: 16,
    },
  },
});

export const copyRight = style({
  width: '100%',
  maxWidth: 1124,
  textAlign: 'center',
  fontSize: 18,
  color: globals.color.blue_3,
  fontWeight: 500,
  paddingBottom: 16,
  '@media': {
    '(max-width: 768px)': {
      fontSize: 10,
      padding: 16,
      textAlign: 'end',
    },
  },
});
