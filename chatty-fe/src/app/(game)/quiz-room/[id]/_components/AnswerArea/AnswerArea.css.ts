import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const Container = style({
  display: 'flex',
  padding: 12,
  justifyContent: 'space-between',
  gap: 40,
  borderRadius: 20,
  backgroundColor: globals.color.blue_6,
  width: '100%',
});

export const Wrapper = style({
  width: '100%',
});

export const Answer = style({
  fontSize: 40,
  fontFamily: 'var(--bagel-font)',
});

export const RadioButtonWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 10,
  borderRadius: 12,
});
