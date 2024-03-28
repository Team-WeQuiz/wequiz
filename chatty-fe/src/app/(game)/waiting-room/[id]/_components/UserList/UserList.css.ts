import { style } from '@vanilla-extract/css';
import { globals } from '@/app/globals.css';

export const mainContainer = style({
  width: '100%',
  minHeight: 792,
  padding: '24px',
  borderRadius: 20,
  backgroundColor: globals.color.blue_6,
});
