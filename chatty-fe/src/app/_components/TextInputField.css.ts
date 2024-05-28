import { style } from '@vanilla-extract/css';
import { globals } from '../globals.css';

export const container = style({
  display: 'flex',
  height: 60,
  width: '100%',
  padding: '20px 12px',
  alignItems: 'center',
  gap: 10,
  color: globals.color.black,
  border: `1px solid ${globals.color.black_6}`,
  '::placeholder': {
    color: globals.color.black_3,
  },
  ':focus': {
    border: 'none',
    outline: `1px solid ${globals.color.black_3}`,
  },
});

export const chatContainer = style([
  container,
  {
    position: 'relative',
    justifyContent: 'space-between',
    backgroundColor: globals.color.blue_6,
    borderRadius: 20,
    cursor: 'text',
    ':focus-within': {
      outline: '2px solid blue',
    },
  },
]);

export const chatInput = style({
  border: 'none',
  flexGrow: 1,
  color: globals.color.black_3,
  backgroundColor: 'inherit',
  ':focus': {
    outline: 'none',
  },
});

export const defaultInput = style({
  position: 'relative',
});

export const endAdornment = style({
  position: 'absolute',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
});
