import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const Container = style({
  display: 'flex',
  padding: 12,
  justifyContent: 'space-between',
  gap: 40,
  borderRadius: 20,
  backgroundColor: globals.color.blue_6,
  width: '100%',
});

export const Wrapper = style({
  width: '100%',
});

export const Answer = style({
  fontSize: 40,
  fontFamily: 'var(--bagel-font)',
});

export const RadioButtonWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  borderRadius: 12,
  background: '#fff',
  padding: 20,
});
export const LabelWrapper = style({
  display: 'flex',
  padding: 4,
  gap: 10,
  ':hover': {
    background: '#f7f7f7',
    borderRadius: 8,
  },
});

export const RadioButton = style({
  display: 'flex',
  justifyContent: 'center',
  width: 22,
  height: 22,
  stroke: 'black',
  border: '1px solid black',
  borderRadius: '50%',
  flexShrink: 0,
  background: 'white',
  color: 'black',
  fontSize: 16,
  fontWeight: 400,
  margin: 0,
  padding: 0,
});

export const SelectedButton = style({
  display: 'flex',
  justifyContent: 'center',
  width: 22,
  height: 22,
  stroke: globals.color.blue_main,
  border: `1px solid ${globals.color.blue_main}`,
  borderRadius: '50%',
  flexShrink: 0,
  background: globals.color.blue_main,
  color: 'white',
  fontSize: 16,
  fontWeight: 400,
  margin: 0,
  padding: 0,
});

export const SelectedLabel = style({
  color: globals.color.blue_main,
});

export const Label = style({
  color: 'black',
});
