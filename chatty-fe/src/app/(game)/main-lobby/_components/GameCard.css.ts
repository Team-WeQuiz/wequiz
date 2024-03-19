import { style } from '@vanilla-extract/css';
import { globals } from '../../../globals.css';

export const gameCard = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: 10,
  gap: 10,
  backgroundColor: globals.color.blue_7,
  borderRadius: 16,
  boxShadow: '0px 0px 4px 4px rgba(17, 41, 66, 0.25)',
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
});

export const gameParticipants = style({
  display: 'flex',
});
