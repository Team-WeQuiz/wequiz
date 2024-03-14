import { style } from '@vanilla-extract/css';
import { globals } from '../globals.css';

export const container = style({
  display: 'flex',
  height: 60,
  width: '100%',
  padding: '20px 12px',
  alignItems: 'center',
  justifyContent: 'space-around',
  borderRadius: 12,
  color: globals.color.black,
  border: `1px solid ${globals.color.black_6}`,
  fontSize: 16,
  backgroundColor: '#fff',
});

export const labelContainer = style({
  display: 'flex',
  padding: '20px 12px',
  alignItems: 'center',
  gap: 6,
});

export const label = style({
  color: globals.color.black_3,
});

export const selectedLabel = style({
  color: globals.color.blue_main,
});
