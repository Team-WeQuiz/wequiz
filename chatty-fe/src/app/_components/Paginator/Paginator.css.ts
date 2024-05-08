import { style } from '@vanilla-extract/css';
import { globals } from '@/app/globals.css';

export const paginator = style({
  display: 'flex',
  gap: 15,
  alignItems: 'center',
  justifyContent: 'center',
});

export const pageStatus = style({
  display: 'flex',
  height: 30,
  alignItems: 'flex-end',
  fontFamily: 'var(--bagel-font)',
  color: '#fff',
  fontSize: 24,
  WebkitTextStrokeColor: globals.color.blue_5,
  WebkitTextStrokeWidth: 1,
});

export const blueText = style({
  color: globals.color.blue_4,
  WebkitTextStrokeColor: globals.color.blue_3,
});

export const triangularButton = style({
  position: 'relative',
  backgroundColor: '#fff',
  textAlign: 'left',
  width: 12,
  height: 12,
  borderTopRightRadius: '40%',
  cursor: 'pointer',
  transform: 'rotate(-60deg) skewX(-30deg) scale(1,.866)',
  '::before': {
    width: 12,
    height: 12,
    borderTopRightRadius: '40%',
    content: '""',
    position: 'absolute',
    backgroundColor: 'inherit',
    transform:
      'rotate(-135deg) skewX(-45deg) scale(1.414,.707) translate(0,-50%)',
  },
  '::after': {
    width: 12,
    height: 12,
    borderTopRightRadius: '40%',
    content: '""',
    position: 'absolute',
    backgroundColor: 'inherit',
    transform: 'rotate(135deg) skewY(-45deg) scale(.707,1.414) translate(50%)',
  },
});

export const blueButton = style({
  backgroundColor: globals.color.blue_4,
});

export const previousButton = style({
  transform: 'rotate(-90deg)',
  ':active': { transform: 'rotate(-90deg) scale(0.9)' },
});

export const nextButton = style({
  transform: 'rotate(90deg)',
  ':active': { transform: 'rotate(90deg) scale(0.9)' },
});

export const emptySpace = style({
  height: 18,
  width: 16,
});
