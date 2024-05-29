import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { globals } from '../globals.css';

export const gradButton = recipe({
  base: {
    position: 'relative',
    minHeight: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '18px 18px',
    borderRadius: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s, box-shadow 0.2s, transform 0.2s',
    ':active': {
      transform: 'scale(0.99)',
    },
  },

  variants: {
    color: {
      primary: {
        background: `linear-gradient(180deg, rgba(38, 146, 255, 0.10) 0%, #2692FF 77.5%), #eaf4ff`,
        boxShadow: '0px 2px 4px 2px rgba(23, 96, 171, 0.30)',
        ':hover': {
          boxShadow: '0px 3px 5px 3px rgba(23, 96, 171, 0.30)',
        },
        textShadow: `1px 1px 1px ${globals.color.blue_stroke}, 
          -1px -1px 1px ${globals.color.blue_stroke}, 
          1px -1px 1px ${globals.color.blue_stroke}, 
          -1px 1px 1px ${globals.color.blue_stroke}`,
      },
      secondary: {
        background:
          'linear-gradient(180deg, rgba(255, 181, 38, 0.10) 0%, #FFB526 77.5%), #fff8ec',
        boxShadow: '0px 2px 4px 2px rgba(169, 121, 29, 0.30)',
        ':hover': {
          boxShadow: '0px 3px 5px 3px rgba(169, 121, 29, 0.30)',
        },
        textShadow: `1px 1px 1px ${globals.color.sub_stroke}, 
          -1px -1px 1px ${globals.color.sub_stroke}, 
          1px -1px 1px ${globals.color.sub_stroke}, 
          -1px 1px 1px ${globals.color.sub_stroke}`,
      },
    },
    rounded: {
      true: {
        borderRadius: 50,
        padding: '18px 24px',
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
    },
    disabled: {
      true: {
        // background: `linear-gradient(180deg, rgba(230, 230, 230, 0.10) 0%, #aaaaaa 77.5%), white`,
        cursor: 'default',
        ':active': {
          transform: 'none',
        },
        textShadow: `1px 1px 1px ${globals.color.black_4}, 
        -1px -1px 1px ${globals.color.black_4}, 
        1px -1px 1px ${globals.color.black_4}, 
        -1px 1px 1px ${globals.color.black_4}`,
        ':after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(200, 200, 200, 0.5)',
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
  compoundVariants: [
    {
      variants: {
        disabled: true,
        rounded: true,
      },
      style: {
        ':after': {
          borderRadius: 50,
        },
      },
    },
    {
      variants: {
        disabled: true,
        rounded: false,
      },
      style: {
        ':after': {
          borderRadius: 12,
        },
      },
    },
  ],
});

export const loadingContainer = style({
  position: 'absolute',
  top: '10%',
  left: 0,
  width: '100%',
  height: '80%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
});
