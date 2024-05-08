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
  width: '100%',
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

export const radioButtonWrapper = style({
  display: 'flex',
  width: '100%',
  height: 60,
  gap: 10,
  alignItems: 'center',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 10,
  border: `1px solid ${globals.color.black_6}`,
});

export const titleWrapper = style({
  width: 956,
});

export const defaultWrapper = style({
  width: 404,
});

export const buttonContainer = style({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  height: 60,
});

export const buttonWrapper = style({
  width: 252,
});

export const ContainerTitle = style({
  fontSize: 16,
  fontWeight: 600,
  padding: '10px',
});

export const FullWrapper = style({
  width: 956,
});
