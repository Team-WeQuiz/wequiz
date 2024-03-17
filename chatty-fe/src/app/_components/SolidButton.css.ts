import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { globals } from '../globals.css';

export const solidButton = recipe({
  base: {
    minHeight: 60,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '18px 18px',
    borderRadius: 12,
    backgroundColor: globals.color.blue_main,
    color: '#FFFFFF',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s, box-shadow 0.2s, transform 0.2s',
    ':active': {
      transform: 'scale(0.99)',
    },
  },
  variants: {
    shadowExist: {
      true: {
        boxShadow: '0px 0px 4px 2px rgba(23, 96, 171, 0.25)',
        ':hover': {
          boxShadow: '0px 0px 5px 3px rgba(23, 96, 171, 0.25)',
        },
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
    },
    disabled: {
      true: {
        backgroundColor: globals.color.black_6,
        cursor: 'default',
        boxShadow: 'none',
        ':hover': {
          boxShadow: 'none',
        },
        ':active': {
          transform: 'none',
        },
      },
    },
    isLoading: {
      true: {
        cursor: 'default',
        pointerEvents: 'none',
      },
    },
  },
});

export const loadingContainer = style({
  position: 'absolute',
  top: 'calc(50% - 8px)',
  left: 0,
  width: '100%',
  height: 16,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(38, 146, 255, 0.5)',
});
