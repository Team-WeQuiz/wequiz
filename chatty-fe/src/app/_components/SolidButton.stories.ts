import { Meta, StoryObj } from '@storybook/react';
import SolidButton from './SolidButton';

const meta = {
  title: 'Components/SolidButton',
  component: SolidButton,
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
    shadowExist: { control: 'boolean' },
    fullWidth: { control: 'boolean', defaultValue: false },
  },
} satisfies Meta<typeof SolidButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Button',
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

export const NonShadow: Story = {
  args: {
    children: 'Non-shadow Button',
    shadowExist: false,
  },
};

export const FullWidth: Story = {
  args: {
    children: 'FullWidth Button',
    fullWidth: true,
  },
};
