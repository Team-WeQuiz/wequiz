import { style } from '@vanilla-extract/css';
import { globals } from '@/app/globals.css';

export const labelContainer = style({
  display: 'flex',
  width: 60,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  padding: '4px 16px',
  backgroundColor: globals.color.black_5,
});

export const koreanLabel = style({
  backgroundColor: globals.subjectColor.korean,
});

export const mathLabel = style({
  backgroundColor: globals.subjectColor.math,
});

export const englishLabel = style({
  backgroundColor: globals.subjectColor.english,
});

export const historyLabel = style({
  backgroundColor: globals.subjectColor.history,
});

export const scienceLabel = style({
  backgroundColor: globals.subjectColor.science,
});

export const socialLabel = style({
  backgroundColor: globals.subjectColor.social,
});

export const labelText = style({
  fontSize: 12,
  fontWeight: 500,
  color: globals.color.white,
});
