import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const Container = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minWidth: 600,
  maxWidth: 1000,
  background: globals.color.blue_6,
  borderRadius: 16,
  '@media': {
    '(max-width: 768px)': {
      minWidth: 300,
    },
  },
});

export const Title = style({
  display: 'flex',
  width: '100%',
  alignItems: 'baseline',
  gap: 16,
  padding: 16,
});

export const TitleText = style({
  fontSize: 24,
  fontWeight: 600,
  '@media': {
    '(max-width: 768px)': {
      fontSize: 18,
    },
  },
});

export const Number = style({
  fontFamily: 'var(--bagel-font)',
});

export const Wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'stretch',
  gap: 10,
  padding: 16,
  width: '100%',
  height: '100%',
});

export const comparingCard = style({
  border: `1px solid ${globals.color.blue_main}`,
});

export const Card = style({
  display: 'flex',
  width: '100%',
  padding: 16,
  gap: 16,
  background: '#fff',
  borderRadius: 12,
  alignItems: 'center',
});

export const AnswerContainer = style({
  display: 'flex',
  padding: 16,
  flexDirection: 'column',
  background: '#fff',
  borderRadius: 16,
  gap: 8,
});

export const AnswerWrapper = style({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
});

export const MyAnswerWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: 8,
});

export const divider = style({
  width: '100%',
  borderTop: `1px dashed ${globals.color.blue_main}`,
});

export const Description = style({
  color: globals.color.black_3,
  fontSize: 14,
  paddingLeft: 8,
});

export const myAnswerCardCorrect = style({
  border: '1px solid #D4E7D1',
});

export const myAnswerCardWrong = style({
  border: '1px solid #E1CDCD',
});

export const UserWrapper = style({
  display: 'inline-flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  gap: 8,
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
    flexWrap: 'wrap',
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
    flexWrap: 'wrap',
  },
]);

export const CorrectAnswerMark = style({
  color: globals.color.blue_main,
  fontFamily: 'var(--bagel-font)',
  fontSize: 30,
});

export const ProfileWrapper = style({
  display: 'flex',
  gap: 8,
  padding: 2,
  justifyContent: 'center',
  alignItems: 'center',
});

export const ImageWrapper = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  border: `1px solid ${globals.color.blue_2}`,
});

export const nickname = style({
  color: globals.color.black_3,
});

export const answer = style({
  width: '100%',
  wordWrap: 'break-word',
  overflowWrap: 'break-word',
});
