import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const Container = style({
  display: 'flex',
  width: '100%',
});

export const SideBarWrapper = style({
  width: 80,
  height: '100%',
  flexShrink: 0,
  //   boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
});

export const SideBar = style({
  display: 'inline-flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '0px 11px',
  gap: 30,
});

export const ContentsContainer = style({
  display: 'flex',
  justifyContent: 'center',
  padding: 20,
  paddingTop: 0,
});

export const ContentsBox = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  gap: 60,
  borderRadius: 20,
  backgroundColor: globals.color.blue_7,
});

export const ContentsWrapper = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 24,
});

export const ContentsCard = style({
  display: 'flex',
  padding: 24,
  justifyContent: 'space-around',
  gap: 24,
  borderRadius: 20,
  width: '80%',
  backgroundColor: globals.color.blue_6,
});

export const Number = style({
  width: 80,
  height: 58,
  fontFamily: 'var(--bagel-font)',
  fontSize: 40,
});

export const QuestionCard = style({
  display: 'flex',
  width: '35%',
  height: '100%',
  padding: 16,
  gap: 10,
  backgroundColor: '#fff',
  borderRadius: 20,
  fontSize: 20,
});

export const QuestionMark = style({
  color: globals.color.blue_main,
  fontFamily: 'var(--bagel-font)',
  fontSize: 20,
});

export const WrongAnswerCard = style([
  QuestionCard,
  {
    backgroundColor: '#fff8fb',
  },
]);

export const WrongAnswerMark = style({
  color: '#FF0C0C',
  fontFamily: 'var(--bagel-font)',
  fontSize: 20,
});

export const CorrectAnswerCard = style([
  QuestionCard,
  {
    backgroundColor: '#fafff9',
  },
]);

export const CorrectAnswerMark = style({
  color: '#31DB06',
  fontFamily: 'var(--bagel-font)',
  fontSize: 20,
});

export const ModalButton = style({
  display: 'flex',
  flexDirection: 'column',
  width: 80,
  height: '100%',
  padding: '57px 10px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 4,
  borderRadius: 20,
  backgroundColor: globals.color.blue_7,
  boxShadow: '0px 0px 4px 2px rgba(23, 96, 171, 0.25)',
  cursor: 'pointer',
  color: globals.color.blue_main,
  ':active': {
    transform: 'scale(0.99)',
  },
});
