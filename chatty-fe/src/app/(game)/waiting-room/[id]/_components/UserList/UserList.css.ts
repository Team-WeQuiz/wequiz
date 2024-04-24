import { style } from '@vanilla-extract/css';
import { globals } from '@/app/globals.css';

export const mainContainer = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 24,
  width: '100%',
  height: '100%',
  padding: '24px',
  borderRadius: 20,
  backgroundColor: globals.color.blue_6,
  overflowY: 'auto',
});
