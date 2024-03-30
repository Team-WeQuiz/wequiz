import { style } from '@vanilla-extract/css';
import { globals } from '@/app/globals.css';

export const infoCard = style({
  width: '100%',
  padding: 12,
  borderRadius: 20,
  backgroundColor: globals.color.blue_6,
});

export const header = style({
  position: 'relative',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 63,
});

export const decoIcon = style({
  position: 'absolute',
  top: -50,
  left: 0,
});

export const name = style({
  width: '100%',
  textAlign: 'center',
  backgroundColor: globals.color.blue_main,
  borderRadius: 16,
  padding: '12px 8px',
  fontSize: 20,
  fontWeight: 600,
  color: 'white',
});

export const description = style({
  width: '100%',
  minHeight: 110,
  padding: '16px 12px',
  textAlign: 'center',
  color: globals.color.black_3,
  fontSize: 16,
  fontWeight: 400,
});

export const detail = style({
  width: '100%',
  padding: '14px',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  gridGap: 16,
});

export const detailBlock = style({
  display: 'flex',
  width: '100%',
  maxWidth: 188,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  padding: '12px 0',
  color: globals.color.black,
  fontWeight: 400,
  backgroundColor: globals.color.blue_7,
  borderRadius: 16,
});

export const detailLabel = style({
  fontSize: 20,
});

export const detailValue = style({
  fontSize: 26,
});
