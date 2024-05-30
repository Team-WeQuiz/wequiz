import { Meta, StoryObj } from '@storybook/react';
import PercentageCircle from './PercentageCircle';

const meta = {
  title: 'Components/PercentageCircle',
  component: PercentageCircle,
} satisfies Meta<typeof PercentageCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    color: '#FF0C0C',
    percentage: 0,
  },
};

export const Default1: Story = {
  args: {
    color: '#FF0C0C',
    percentage: 25,
  },
};

export const Default2: Story = {
  args: {
    color: '#77F359',
    percentage: 50,
  },
};

export const Default3: Story = {
  args: {
    color: '#51A8FF',
    percentage: 75,
  },
};

export const Default4: Story = {
  args: {
    color: '#51A8FF',
    percentage: 100,
  },
};
