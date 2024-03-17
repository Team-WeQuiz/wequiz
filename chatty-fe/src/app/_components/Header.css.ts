import { style } from '@vanilla-extract/css';
import { globals } from '../globals.css';

export const container = style({
  display: 'flex',
  width: '100%',
  height: 64,
  padding: '0px 30px',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: globals.color.blue_6,
});
