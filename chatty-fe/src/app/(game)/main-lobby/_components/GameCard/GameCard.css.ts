import { style } from '@vanilla-extract/css';
import { globals } from '../../../../globals.css';

export const gameCard = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: 10,
  gap: 10,
  backgroundColor: globals.color.blue_7,
  borderRadius: 16,
  boxShadow: '0px 0px 4px 4px rgba(17, 41, 66, 0.25)',
  cursor: 'pointer',
  position: 'relative',
});

export const gameTitle = style({
  alignItems: 'center',
  fontSize: 20,
  fontWeight: '600',
  backgroundColor: globals.color.blue_6,
  padding: '8px 10px',
  borderRadius: 12,
});

export const gameInfo = style({
  display: 'flex',
  width: '100%',
  gap: 10,
  justifyContent: 'space-between',
  minHeight: 50,
});

export const gameDescription = style({
  display: 'flex',
  flexDirection: 'column',
  padding: '0 10px',
  color: globals.color.black_2,
  fontSize: 16,
  fontWeight: '400',
});

export const gameParticipants = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: 4,
});

export const partNum = style({
  display: 'flex',
  color: globals.color.blue_main,
  fontSize: 16,
  fontWeight: '400',
  height: 24,
  alignItems: 'center',
  fontFamily: 'var(--bagel-font)',
});

export const overlay = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0)',
  borderRadius: 16,
  //display: 'none',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 24,
  fontWeight: '400',
  color: 'rgba(0, 0, 0, 0)',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease-in-out',
});

export const gameCardHover = style({
  [`&:hover .${overlay}`]: {
    display: 'flex',
    backgroundColor: 'rgba(17, 41, 66, 0.30)',
    color: 'white',
  },
});
