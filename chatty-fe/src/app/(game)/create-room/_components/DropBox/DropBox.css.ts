import { style } from '@vanilla-extract/css';

export const MainContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
});

export const Container = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 60,
  padding: '20px 12px',
  background: '#FFF',
  borderRadius: 12,
});

export const ListNone = style({
  display: 'none',
});

export const List = style({
  display: 'block',
  listStyle: 'none',
  padding: 0,
  margin: 0,
  overflow: 'scroll',
  border: 'none',
  maxHeight: '250px',
  background: '#FFF',
  overflowX: 'hidden',
  borderRadius: 12,
});

export const ListItem = style({
  padding: '8px 12px',
  border: 'none',
  ':hover': {
    background: '#f7f7f7',
  },
});

export const ButtonWrapper = style({
  cursor: 'pointer',
});

export const NoneSelected = style({
  color: '#666',
});
