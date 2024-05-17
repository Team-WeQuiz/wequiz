import { style } from '@vanilla-extract/css';
import { globals } from '@/app/globals.css';

export const mainContainer = style({
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  height: '100%',
  padding: '24px',
  borderRadius: 20,
  backgroundColor: globals.color.blue_6,
  overflowY: 'auto',
  alignContent: 'flex-start',
  '@media': {
    '(max-width: 768px)': {
      padding: '12px',
    },
  },

});

export const cardArea = style({
  maxWidth: 300,
  maxHeight: 350,
  padding: 5,
  "@media": {
    "(max-width: 768px)": {
      padding: 2,
    },
  },
});
