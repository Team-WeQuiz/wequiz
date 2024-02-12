import { style } from '@vanilla-extract/css';

export const button = style({
  display: 'flex',
  padding: '8px 32px',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 8,
  backgroundColor: '#e6e6e6',
  color: '#999',
  fontSize: 16,
  fontWeight: 500,
  border: 'none',
});
