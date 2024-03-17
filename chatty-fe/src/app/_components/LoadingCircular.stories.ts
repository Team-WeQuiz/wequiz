import { Meta, StoryObj } from '@storybook/react';
import LoadingCircular from './LoadingCircular';

const meta = {
  title: 'Components/LoadingCircular',
  component: LoadingCircular,
  argTypes: {
    color: { control: 'text' },
  },
} satisfies Meta<typeof LoadingCircular>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    color: 'red',
  },
};