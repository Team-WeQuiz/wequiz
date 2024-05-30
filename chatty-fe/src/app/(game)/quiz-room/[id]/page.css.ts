import { globals } from '@/app/globals.css';
import { style } from '@vanilla-extract/css';

export const Main = style({
  display: 'flex',
  width: '100%',
  maxWidth: 1830,
  gap: 30,
  height: '100%',
  position: 'relative',
});

export const MainContainer = style({
  maxWidth: 1314,
  width: 'calc(73% - 15px)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 30,
  '@media': {
    '(max-width: 768px)': {
      maxWidth: 768,
      width: '100%',
      position: 'absolute',
      gap: 12,
      top: 130,
      left: 0,
      zIndex: 10,
      height: 'calc(100% - 130px)',
    },
  },
});

export const StatusContainer = style({
  maxWidth: 486,
  width: 'calc(28% - 15px)',
  display: 'flex',
  position: 'relative',
  height: '100%',
  '@media': {
    '(max-width: 768px)': {
      maxWidth: 768,
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 10,
      height: 120,
    },
  },
});

export const Container = style({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 20,
  backgroundColor: globals.color.blue_7,
  maxWidth: 1372,
  width: '100%',
  height: '100%',
  padding: 20,
  justifyContent: 'space-between',
  '@media': {
    '(max-width: 768px)': {
      padding: 16,
      overflowY: 'scroll',
    },
  },
});

export const ContentsWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 30,
  '@media': {
    '(max-width: 768px)': {
      gap: 12,
    },
  },
});

export const Navigation = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
  '@media': {
    '(max-width: 768px)': {
      marginBottom: 0,
    },
  },
});

export const RoundWrapper = style({
  color: globals.color.blue_main,
  fontSize: 40,
  fontFamily: 'var(--bagel-font)',
  '@media': {
    '(max-width: 768px)': {
      fontSize: 20,
    },
  },
});

export const QuestionContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 50,
  alignItems: 'center',
  justifyContent: 'center',
  '@media': {
    '(max-width: 768px)': {
      gap: 12,
    },
  },
});

export const ButtonWrapper = style({
  display: 'flex',
  margin: '50px auto',
  width: 252,
  '@media': {
    '(max-width: 768px)': {
      width: '100%',
      margin: '20px auto',
    },
  },
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
  minHeight: '150px',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 24,
  '@media': {
    '(max-width: 768px)': {
      minHeight: '80px',
      gap: 12,
    },
  },
});

export const StatusText = style({
  fontSize: 16,
  '@media': {
    '(max-width: 768px)': {
      fontSize: 12,
      textAlign: 'center',
    },
  },
});

export const Count = style({
  fontSize: 40,
  fontFamily: 'var(--bagel-font)',
  color: '#ffb526',
  '@media': {
    '(max-width: 768px)': {
      fontSize: 26,
    },
  },
});
