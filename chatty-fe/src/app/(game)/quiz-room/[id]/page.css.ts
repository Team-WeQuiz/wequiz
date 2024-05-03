import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const Main = style({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  gap: 30,
});

export const MainContainer = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: 1372,
  gap: 30,
});

export const Container = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  borderRadius: 20,
  backgroundColor: globals.color.blue_7,
  maxWidth: 1372,
  width: '100%',
  padding: 20,
  justifyContent: 'space-between',
});

export const ContentsWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 30,
});

export const Navigation = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
});

export const RoundWrapper = style({
  color: globals.color.blue_main,
  fontSize: 40,
  fontFamily: 'var(--bagel-font)',
});

export const QuestionContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 50,
  alignItems: 'center',
  justifyContent: 'center',
});

export const ButtonWrapper = style({
  display: 'flex',
  margin: '50px auto',
  width: 252,
});

export const UserContainer = style({
  display: 'flex',
  flexDirection: 'column',
  padding: 12,
  width: 458,
  height: 902,
  borderRadius: 20,
  background: globals.color.blue_6,
  gap: 30,
});

export const StatusWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  gap: 24,
});
