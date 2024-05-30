import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const Wrapper = style({
  display: 'flex',
  gap: 36,
  alignItems: 'center',
  "@media" : {
    "(max-width: 768px)": {
      gap: 12,
    }
  }
});

export const WrapperColumn = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 36,
  alignItems: 'center',
});

export const Container = style({
  position: 'relative',
  display: 'inline-block',
});

export const MobileRound = style({
  '@media': {
    '(max-width: 768px)': {
      width: 25,
      height: 25,
    },
  },
});

export const TextGrey = style({
  position: 'absolute',
  top: '45%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: 30,
  color: globals.color.black_4,
  fontFamily: 'var(--bagel-font)',
  WebkitTextStrokeWidth: 1,
  WebkitTextStrokeColor: '#fff',
  '@media': {
    '(max-width: 768px)': {
      fontSize: 16,
    },
  },
});

export const TextBlue = style({
  position: 'absolute',
  top: '45%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: 30,
  color: globals.color.blue_main,
  fontFamily: 'var(--bagel-font)',
  WebkitTextStrokeWidth: 1,
  WebkitTextStrokeColor: '#fff',
  '@media': {
    '(max-width: 768px)': {
      fontSize: 16,
    },
  },
});
