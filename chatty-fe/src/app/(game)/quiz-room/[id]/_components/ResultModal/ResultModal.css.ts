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
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-around',
  width: '80%',
  height: '60%',
  borderRadius: 16,
  background: '#FFF',
});

export const Title = style({
  color: globals.color.blue_main,
  fontSize: '20px',
});

export const ResultBox = style({
  display: 'flex',
  padding: '8px 0px',
  gap: 64,
  maxWidth: '100%',
  justifyContent: 'center',
  backgroundColor: globals.color.blue_7,
  '@media': {
    '(max-width: 768px)': {
      gap: 32,
      padding: '4px 0px',
    },
    '(max-width: 480px)': {
      flexDirection: 'column',
      gap: 16,
    },
  },
});

export const RankingBox = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 12,
});

export const RankingContents = style({
  display: 'flex',
  padding: '2px 0px',
  alignItems: 'center',
  maxWidth: '100%',
  gap: 24,
});

export const MyRankingContents = style([
  RankingContents,
  {
    backgroundColor: globals.color.blue_6,
  },
]);

export const RankingNumberWrapper = style({
  display: 'flex',
  width: 30,
  height: 23,
  padding: '0px 4px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 10,
});

export const NickNameArea = style({
  maxWidth: '60%',
});

export const ScoreArea = style({
  width: 50,
  height: 19,
});

export const RankingNumber = style({
  fontFamily: 'var(--bagel-font)',
  fontSize: 16,
  fontWeight: 700,
});

export const Button = style({
  display: 'inline-flex',
  padding: '8px 12px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 12,
  borderRadius: 20,
  background: globals.color.blue_5,
});

export const ButtonText = style({
  color: '#fff',
  fontWeight: 400,
});

export const CountText = style({
  color: globals.color.blue_main,
  fontWeight: 400,
});
