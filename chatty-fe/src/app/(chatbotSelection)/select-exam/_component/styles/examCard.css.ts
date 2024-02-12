import { globals } from '@/app/globals.css';
import { recipe } from '@vanilla-extract/recipes';

export const card = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 588,
    height: 352,
    padding: '8px 16px',
    borderRadius: 12,
    fontSize: 24,
    cursor: 'pointer',
  },
  variants: {
    selected: {
      true: {
        backgroundColor: globals.color.main_7,
        color: globals.color.main,
        fontWeight: 700,
        boxShadow: '0px 2px 6px 0px rgba(255, 168, 0, 0.40)',
      },
      false: {
        backgroundColor: '#fff',
        fontWeight: 500,
        color: '#ccc',
        boxShadow: '0px 2px 6px 0px rgba(153, 153, 153, 0.25)',
      },
    },
  },
});
