import { style } from '@vanilla-extract/css';
import { globals } from '@/app/globals.css';

export const container = style({
  display: 'flex',
  alignItems: 'center',
  padding: 5,
  justifyContent: 'center',
  borderRadius: 16,
  transition:
    'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out, transform 0.2s ease',
  cursor: 'pointer',
  ':active': {
    transform: 'scale(0.98)',
  },
});

export const contained = style({
  padding: '10px 20px',
  backgroundColor: globals.color.main,
  boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.02)',
  ':hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  color: globals.color.white,
  ':active': {
    transform: 'scale(0.98)',
  },
});

export const outlined = style({
  padding: '15px 20px',
  border: `2px solid ${globals.color.main}`,
  ':hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  color: globals.color.main,
});

export const text = style({
  color: globals.color.main,
  ':hover': {
    backgroundColor: globals.color.main_6,
  },
});
