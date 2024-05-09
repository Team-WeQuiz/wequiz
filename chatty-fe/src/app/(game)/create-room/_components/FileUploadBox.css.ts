import { globals } from '@/app/globals.css';
import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

const colorChange = keyframes({
  '0%': { color: globals.color.blue_2 },
  '25%': { color: globals.color.blue_3 },
  '50%': { color: globals.color.blue_4 },
  '75%': { color: globals.color.blue_3 },
  '100%': { color: globals.color.blue_2 },
});

export const container = recipe({
  base: {
    display: 'flex',
    width: 'inherit',
    height: 228,
    padding: '20px 12px',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  variants: {
    isUploaded: {
      true: {
        fontSize: 24,
      },
    },
    isUploading: {
      true: {
        animation: `${colorChange} 1.5s ease-in-out infinite`,
        fontSize: 24,
      },
    },
  },
});

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 40,
});

export const ddWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 10,
  color: '#999',
  fontSize: 16,
  fontWeight: 500,
});

export const title = style({
  color: globals.color.black_3,
  fontSize: 16,
  fontWeight: 400,
});

export const FileListContainer = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: 4,
});

export const FileListWrapper = style({
  display: 'flex',
  borderRadius: 12,
  gap: 6,
});

export const FileName = style({
  fontSize: 16,
});

export const FileDeleteButton = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 16,
  height: 16,
  backgroundColor: globals.color.black_6,
  cursor: 'pointer',
});
