import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  width: 114,
  padding: '18px 20px 18px 10px',
  alignItems: 'center',
  gap: 4,
  borderRadius: 12,
  backgroundColor: '#fff',
});

export const title = style({
  color: globals.color.black,
  fontSize: 16,
  fontWeight: 600,
  lineHeight: 'normal',
  whiteSpace: 'nowrap',
});
