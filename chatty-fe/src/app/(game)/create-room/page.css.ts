import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const mainContainer = style({
  display: 'flex',
  flexDirection: 'column',
});

export const container = style({
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 30,
  maxWidth: 1128,
});

export const title = style({
  fontSize: 30,
});

export const contentsContainer = style({
  width: 'inherit',
  padding: 20,
  margin: 'auto',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
  backgroundColor: globals.color.blue_6,
  borderRadius: 20,
});

export const contentsWrapper = style({
  margin: 'auto',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 10,
});

export const titleWrapper = style({
  width: 956,
});

export const defaultWrapper = style({
  width: 404,
});
