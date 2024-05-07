import { style } from '@vanilla-extract/css';
import { globals } from '../../globals.css';

export const container = style({
  display: 'flex',
  width: '100%',
  height: 64,
  padding: '0px 30px',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: globals.color.blue_6,
});

export const profileButton = style({
  position: 'relative',
  display: 'inline-block',
});

export const dropdownMenu = style({
  position: 'absolute',
  top: 56,
  right: 0,
  display: 'flex',
  padding: 0,
  width: 120,
  zIndex: 1,
  backgroundColor: '#fff',
  borderRadius: 8,
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
});

export const dropdownMenuList = style({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
});

export const menuButton = style({
  width: '100%',
  padding: 10,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  borderBottom: `1px solid ${globals.color.black_6}`,
  color: globals.color.black_2,
  ':hover': {
    backgroundColor: globals.color.black_7,
  },
});
