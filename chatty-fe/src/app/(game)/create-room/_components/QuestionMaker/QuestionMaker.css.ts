import { style } from '@vanilla-extract/css';
export const Container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  width: '100%',
});

export const RadioWrapper = style({
  display: 'flex',
  gap: 24,
  justifyContent: 'space-between',
  width: '100%',
});

export const RadioContainer = style({
  padding: '9px 10px',
  height: 40,
  gap: 4,
  borderRadius: 12,
  width: '100%',
  background: '#FFF',
  border: '1px solid #fff',
});

export const RadioContainerChecked = style([
  RadioContainer,
  {
    background: '#D4E9FF',
    border: '1px solid #2692FF',
  },
]);
