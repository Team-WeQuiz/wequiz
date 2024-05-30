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
  '@media': {
    '(max-width: 768px)': {
      gap: 8,
    },
  },
});

export const TextBox = style({
  display: 'flex',
  flex: 1,
  padding: 20,
  alignItems: 'center',
  gap: 12,
  borderRadius: 8,
  background: '#fff',
  lineHeight: 1.5,
  '@media': {
    '(max-width: 768px)': {
      padding: 12,
    },
  },
});

export const Question = style({
  fontSize: 40,
  fontFamily: 'var(--bagel-font)',
  '@media': {
    '(max-width: 768px)': {
      fontSize: 20,
    },
  },
});
