import { createGlobalTheme, globalStyle } from '@vanilla-extract/css';

export const globals = createGlobalTheme(':root', {
  color: {
    blue_main: '#2692FF',
    blue_2: '#51A8FF',
    blue_3: '#7DBEFF',
    blue_4: '#A8D3FF',
    blue_5: '#D4E9FF',
    blue_6: '#E9F4FF',
    blue_7: '#F8FCFF',
    blue_stroke: '#0966C4',
    black: '#000000',
    black_2: '#333333',
    black_3: '#666666',
    black_4: '#999999',
    black_5: '#CCCCCC',
    black_6: '#E6E6E6',
    black_7: '#F7F7F7',
    sub: '#FFB526',
    sub_stroke: '#E59700',
    red: '#FF0C0C',
    green: '#55F02F',
  },
});

globalStyle('*', {
  fontFamily: 'var(--main-font)',
  boxSizing: 'border-box',
  fontSize: '16px',
});

globalStyle('html, body', {
  width: '100%',
  height: '100%',
  margin: 0,
  padding: 0,
  overflowX: 'hidden',
});

globalStyle('h1, h2, h3, h4, h5, h6, p, span', {
  margin: 0,
  padding: 0,
});

globalStyle('button', {
  outline: 'none',
  border: 'none',
  background: 'none',
});

globalStyle('a', {
  textDecoration: 'none',
  color: 'inherit',
});
