import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { globals } from '@/app/globals.css';

export const cardContainer = style({
  display: 'flex',
  padding: '16px 0',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  gap: 16,
  backgroundColor: globals.color.blue_5,
  borderRadius: 20,
  border: '2px solid #fff',
  position: 'relative',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
});

export const readyContainer = style({
  boxShadow: '0 0 18px 0 #2692FF',
});

export const avatar = style({
  position: 'relative',
  display: 'flex',
  height: 250,
  flexDirection: 'column',
  justifyContent: 'flex-end',
  gap: 10,
});

export const chatContainer = recipe({
  base: {
    position: 'absolute',
    bottom: 200,
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    width: '100%',
    alignItems: 'center',
    opacity: 1,
    transition: 'opacity 0.2s ease',
  },
  variants: {
    fadeOut: {
      true: {
        opacity: 0,
      },
    },
  },
});

export const chatMessage = style({
  position: 'relative',
  width: '100%',
  wordWrap: 'break-word',
  backgroundColor: 'white',
  borderRadius: 12,
  color: globals.color.black,
  fontSize: 14,
  fontWeight: 400,
  textAlign: 'center',
  padding: '6px 12px',
  '::after': {
    content: '""',
    position: 'absolute',
    bottom: '-7px',
    left: '50%',
    transform: 'translateX(-50%)',
    borderStyle: 'solid',
    borderWidth: '10px 10px 0',
    borderColor: 'white transparent',
    zIndex: 1,
  },
});

export const profileImage = style({
  width: 192,
  height: 192,
  borderRadius: 192,
});

export const userInfo = style({
  width: '100%',
});

export const line = style({
  width: '100%',
  height: 2,
  background: `linear-gradient(270deg, ${globals.color.blue_4} 0%, #FFF 49.5%, ${globals.color.blue_4} 100%)`,
});

export const userName = style({
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  height: 45,
  color: globals.color.black,
  backgroundColor: globals.color.blue_4,
  fontSize: 24,
  fontWeight: 600,
  justifyContent: 'center',
  alignContent: 'center',
});
