import { style } from '@vanilla-extract/css';
import { globals } from '../../globals.css';
import { recipe } from '@vanilla-extract/recipes';

export const container = style({
  display: 'flex',
  width: '100%',
  height: 64,
  padding: '0px 30px',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: globals.color.blue_6,
});

export const mainButton = style({
  cursor: 'pointer',
  padding: 0,
});

export const buttonsWrapper = style({
  display: 'flex',
  gap: 12,
  alignItems: 'center',
});

export const profileButton = style({
  position: 'relative',
  display: 'inline-block',
  padding: 0,
});

export const profileImage = style({
  borderRadius: '50%',
  border: `1px solid ${globals.color.blue_7}`,
  objectFit: 'cover',
});

export const dropdownMenu = style({
  position: 'absolute',
  top: 56,
  right: 0,
  display: 'flex',
  padding: 0,
  width: 120,
  zIndex: 11,
  backgroundColor: '#fff',
  borderRadius: 8,
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
});

export const dropdownMenuList = style({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
});

export const menuButton = style({
  width: '100%',
  padding: 10,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  borderBottom: `1px solid ${globals.color.black_6}`,
  color: globals.color.black_2,
  ':hover': {
    backgroundColor: globals.color.black_7,
  },
});

export const musicPlayButton = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 48,
  height: 48,
  borderRadius: '50%',
  padding: 0,
  cursor: 'pointer',
  backgroundColor: globals.color.blue_7,
});

export const ModalContainer = style({
  width: '60vw',
  maxWidth: 890,
  height: '100%',
  '@media': {
    '(max-width: 768px)': {
      width: '100%',
      height: '100%',
    },
  },
});

export const LogoWrapper = style({});

export const BoxWrapper = style({
  backgroundColor: globals.color.blue_6,
  borderRadius: 12,
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 12,
  padding: 30,
  overflow: 'auto',
});

export const ContentsBox = style({
  width: '70%',
  height: 52,
  minHeight: 52,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: globals.color.blue_2,
  cursor: 'pointer',
  borderRadius: 12,
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  color: '#fff',
  transition: 'background-color 0.3s',
  '@media': {
    '(max-width: 768px)': {
      width: '100%',
      height: 32,
      minHeight: 32,
    },
  },
});

export const ContentsWrapper = recipe({
  base: {
    display: 'flex',
    width: '70%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 24,
    margin: '12px 0',
    '@media': {
      '(max-width: 768px)': {
        width: '100%',
      },
    },
  },
  variants: {
    visible: {
      true: {
        display: 'flex',
      },
      false: {
        display: 'none',
      },
    },
  },
});

export const ImageWrapper = style({
  display: 'flex',
  position: 'relative',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: 300,
  '@media': {
    '(max-width: 768px)': {
      height: 150,
    },
  },
});

export const ContentsTextWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: globals.color.blue_5,
  borderRadius: 12,
  padding: 30,
  gap: 12,
  wordBreak: 'keep-all',
});

export const BoldText = style({
  fontSize: '1rem',
  fontWeight: '700',
  '@media': {
    '(max-width: 768px)': {
      fontSize: '0.8rem',
    },
  },
});

export const ContentsText = style({
  fontSize: '1rem',
  fontWeight: '400',
  color: globals.color.black_2,
  '@media': {
    '(max-width: 768px)': {
      fontSize: '0.8rem',
    },
  },
});
