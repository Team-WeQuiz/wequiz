import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const ModalBackground = style({
  position: 'fixed',
  top: 0,
  left: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
});

export const Modal = style({
  display: 'flex',
  width: '80%',
  height: '80%',
  borderRadius: 16,
  background: '#FFF',
  justifyContent: 'center',
  alignItems: 'center',
});

export const Container = style({
  display: 'flex',
  flexDirection: 'column',
  width: '95%',
  height: '90%',
  background: globals.color.blue_6,
  borderRadius: 16,
  padding: 30,
});

export const Title = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 16,
  width: '50%',
});

export const Number = style({
  fontSize: 36,
  fontFamily: 'var(--bagel-font)',
});

export const Wrapper = style({
  display: 'inline-flex',
  gap: 12,
  alignItems: 'center',
  padding: '10px 0',
});

export const Card = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  padding: 16,
  gap: 16,
  background: '#fff',
  borderRadius: 12,
  alignItems: 'center',
});

export const UserWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  gap: 8,
  padding: 0,
  margin: 0,
});

export const QuestionMark = style({
  color: globals.color.blue_main,
  fontFamily: 'var(--bagel-font)',
  fontSize: 30,
});

export const WrongAnswerCard = style([
  Card,
  {
    backgroundColor: '#fff8fb',
  },
]);

export const WrongAnswerMark = style({
  color: '#FF0C0C',
  fontFamily: 'var(--bagel-font)',
  fontSize: 30,
});

export const CorrectAnswerCard = style([
  Card,
  {
    backgroundColor: '#fafff9',
  },
]);

export const CorrectAnswerMark = style({
  color: globals.color.blue_main,
  fontFamily: 'var(--bagel-font)',
  fontSize: 30,
});
