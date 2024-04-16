import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const Wrapper = style({
  display: 'flex',
  gap: 36,
  alignItems: 'center',
});

export const Container = style({
  position: 'relative',
  display: 'inline-block',
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
});
