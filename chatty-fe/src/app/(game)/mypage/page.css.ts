import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const mypageContainer = style({
  display: 'flex',
  maxWidth: 1124,
  width: '100%',
  height: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px 0',
});

export const contentContainer = style({
  display: 'flex',
  width: '100%',
  gap: 30,
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: 30,
  marginBottom: 90,
});

export const headerText = style({
  width: '100%',
  textAlign: 'start',
  fontSize: 30,
  fontWeight: 600,
});

export const contentBox = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 20,
  border: `1px solid ${globals.color.blue_5}`,
});
