import { style } from '@vanilla-extract/css';
import { globals } from '../globals.css';

export const squareButton = style({
  minHeight: 60,
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '18px 18px',
  borderRadius: 12,
  color: '#FFFFFF',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s, box-shadow 0.2s, transform 0.2s',
  ':active': {
    transform: 'scale(0.99)',
  },
});

export const primary = style({
  background: `linear-gradient(180deg, rgba(38, 146, 255, 0.10) 0%, #2692FF 77.5%)`,
  boxShadow: '0px 2px 8px 2px rgba(23, 96, 171, 0.30)',
  ':hover': {
    boxShadow: '0px 3px 8px 3px rgba(23, 96, 171, 0.30)',
  },
  WebkitTextStroke: `1px ${globals.color.blue_stroke}`,
});

export const secondary = style({
  background:
    'linear-gradient(180deg, rgba(255, 181, 38, 0.10) 0%, #FFB526 77.5%)',
  boxShadow: '0px 2px 8px 2px rgba(169, 121, 29, 0.30)',
  ':hover': {
    boxShadow: '0px 3px 8px 3px rgba(169, 121, 29, 0.30)',
  },
  WebkitTextStroke: `1px ${globals.color.sub_stroke}`,
});

export const loadingContainer = style({
  position: 'absolute',
  top: 'calc(50% - 8px)',
  left: 0,
  width: '100%',
  height: 16,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export const fullWidth = style({
  width: '100%',
});

export const disabled = style({
  background: globals.color.black_6,
  cursor: 'default',
  boxShadow: 'none',
  ':hover': {
    boxShadow: 'none',
  },
  ':active': {
    transform: 'none',
  },
});

export const loading = style({
  cursor: 'default',
  pointerEvents: 'none',
});
