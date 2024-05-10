import { style } from '@vanilla-extract/css';
import { globals } from '@/app/globals.css';

export const profileWrapper = style({
  position: 'relative',
  display: 'flex',
  width: 120,
  height: 120,
  borderRadius: '50%',
  border: `1px solid ${globals.color.blue_5}`,
  padding: 0,
});

export const profileImage = style({
  borderRadius: '50%',
  width: '100%',
  height: '100%',
});

export const editButton = style({
  position: 'absolute',
  bottom: 0,
  right: 0,
  width: 28,
  height: 28,
  padding: 0,
  cursor: 'pointer',
});

export const cropperModalContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0 20px',
});

export const cropperModalTitle = style({
  color: globals.color.black_2,
  fontWeight: 600,
  marginBottom: 20,
});

export const cropperWrapper = style({
  position: 'relative',
  width: '100%',
  height: 0,
  paddingBottom: '100%',
  borderRadius: 10,
  overflow: 'hidden',
});

export const cropperImage = style({
  width: '100%',
  height: '100%',
  display: 'none',
});

export const buttonGroup = style({
  display: 'flex',
  width: '100%',
  gap: 16,
  marginTop: 16,
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const buttonText = style({
  fontSize: 14,
});
