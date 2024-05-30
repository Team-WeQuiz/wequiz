import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const Container = style({
  display: 'flex',
  width: '100%',
  maxWidth: 1124,
  flexDirection: 'column',
  gap: 36,
});

export const Wrapper = style({
  width: '100%',
});

export const ContentsBox = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 60,
  borderRadius: 20,
  backgroundColor: globals.color.blue_7,
  padding: 24,
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
  gap: 24,
  borderRadius: 20,
  width: '100%',
  backgroundColor: globals.color.blue_6,
  '@media': {
    '(max-width: 768px)': {
      flexDirection: 'column',
      gap: 16,
    },
  },
});

export const CardHeader = style({
  display: 'flex',
  alignItems: 'center',
});

export const MobileStatsArea = style({
  display: 'none',
  '@media': {
    '(max-width: 768px)': {
      display: 'flex',
      width: 'calc(100% - 45px)',
      alignItems: 'center',
      marginTop: 5,
      justifyContent: 'space-between',
    },
  },
});

export const MobileRateText = style({
  fontSize: 18,
});

export const MobileModalButton = style({
  display: 'flex',
  marginTop: 3,
  cursor: 'pointer',
  fontSize: 12,
  color: globals.color.blue_main,
  ':active': {
    transform: 'scale(0.99)',
  },
});

export const StatsArea = style({
  display: 'flex',
  gap: 24,
  '@media': {
    '(max-width: 768px)': {
      display: 'none',
    },
  },
});

export const Number = style({
  width: 58,
  height: 58,
  fontFamily: 'var(--bagel-font)',
  fontSize: 40,
  '@media': {
    '(max-width: 768px)': {
      width: 45,
      height: 40,
      fontSize: 28,
    },
  },
});

export const CardsWrapper = style({
  width: 'calc(100% - 410px)',
  display: 'flex',
  gap: 24,
  '@media': {
    '(max-width: 992px)': {
      flexDirection: 'column',
    },
    '(max-width: 768px)': {
      width: '100%',
    },
  },
});

export const QuestionCard = style({
  display: 'flex',
  width: 'calc(50% - 12px)',
  height: '100%',
  padding: 16,
  gap: 10,
  backgroundColor: '#fff',
  borderRadius: 20,
  fontSize: 20,
  '@media': {
    '(max-width: 992px)': {
      width: '100%',
    },
  },
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
  height: 200,
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

export const SpanText = style({
  width: 'calc(100% - 25px)',
  wordWrap: 'break-word',
  overflowWrap: 'break-word',
  marginTop: 5,
});
