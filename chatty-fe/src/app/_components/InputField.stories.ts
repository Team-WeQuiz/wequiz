import { Meta, StoryObj } from '@storybook/react';
import InputField from './InputField';

const meta = {
  title: 'Components/InputField',
  component: InputField,
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['small', 'medium', 'large'],
      },
    },
  },
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    placeholder: 'Small input',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    placeholder: 'Medium input',
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    placeholder: 'Large input',
    size: 'large',
  },
};
