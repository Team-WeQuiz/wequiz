import { Meta, StoryObj } from '@storybook/react';
import GradButton from './GradButton';

const meta = {
  title: 'Components/GradButton',
  component: GradButton,
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
} satisfies Meta<typeof GradButton>;

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

export const RoundedPrimary: Story = {
  args: {
    children: 'Rounded Primary Button',
    rounded: true,
  },
};

export const RoundedSecondary: Story = {
  args: {
    children: 'Rounded Secondary Button',
    rounded: true,
    color: 'secondary',
  },
};

export const RoundedIsLoading: Story = {
  args: {
    children: 'Rounded Loading Button',
    rounded: true,
    isLoading: true,
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
