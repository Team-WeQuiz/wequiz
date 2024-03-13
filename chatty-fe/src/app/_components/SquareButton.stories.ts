import { Meta, StoryObj } from '@storybook/react';
import SquareButton from './SquareButton';

const meta = {
  title: 'Components/SquareButton',
  component: SquareButton,
  argTypes: {
    disabled: { control: 'boolean' },
    form: { control: 'text' },
    formaction: { control: 'text' },
    formenctype: { control: 'text' },
    formmethod: { control: 'text' },
    formnovalidate: { control: 'boolean' },
    formtarget: { control: 'text' },
    name: { control: 'text' },
    type: { control: 'text' },
    value: { control: 'text' },
    onClick: { action: 'clicked' },
    isLoading: { control: 'boolean' },
    color: { control: 'inline-radio', options: ['primary', 'secondary'] },
    fullWidth: { control: 'boolean', defaultValue: false },
  },
} satisfies Meta<typeof SquareButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    color: 'secondary',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading Button',
    isLoading: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: 'FullWidth Button',
    fullWidth: true,
  },
};
