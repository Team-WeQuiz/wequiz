import { Meta, StoryObj } from '@storybook/react';
import BarSpinner from './BarSpinner';

const meta: Meta<typeof BarSpinner> = {
  title: 'Components/BarSpinner',
  component: BarSpinner,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
