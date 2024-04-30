import { globals } from '@/app/globals.css';
import { keyframes, style } from '@vanilla-extract/css';

export const Spin = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

export const Container = style({
  borderRadius: 30,
  border: `1.5px solid #ffb526`,
  height: 40,
  width: 40,

  position: 'relative',
  // 분침

  '::after': {
    content: '""',
    position: 'absolute',
    backgroundColor: '#ffb526',
    top: 1,
    left: '48%',
    height: 19,
    width: 2,
    borderRadius: 2.5,
    transformOrigin: '50% 97%',
    animation: `${Spin} 2s linear infinite`,
  },
  // 시침

  '::before': {
    content: '""',
    position: 'absolute',
    backgroundColor: '#ffb526',
    left: '48%',
    height: 17.5,
    width: 2,
    top: 3,
    borderRadius: 2.5,
    transformOrigin: '50% 95%',
    animation: `${Spin} 12s linear infinite`,
  },
});
