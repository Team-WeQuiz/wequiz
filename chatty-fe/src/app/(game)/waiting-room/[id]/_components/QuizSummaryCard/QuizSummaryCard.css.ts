import { style } from '@vanilla-extract/css';
import { globals } from '@/app/globals.css';

export const summaryCard = style({
  width: '100%',
  padding: 12,
  borderRadius: 20,
  backgroundColor: globals.color.blue_6,
});

export const summaryTextContainer = style({
  width: '100%',
  height: 100,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  padding: 12,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: globals.color.blue_7,
});
