import { Meta, StoryObj } from '@storybook/react';
import ResultModal from './ResultModal';

const meta = {
  title: 'Components/ResultModal',
  component: ResultModal,
} satisfies Meta<typeof ResultModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentRound: 1,
    users: [
      { id: 1, nickname: '박규연', score: 30 },
      { id: 2, nickname: '김우림', score: 70 },
      { id: 3, nickname: '배준형', score: 999 },
      { id: 4, nickname: '안금장', score: 70 },
      { id: 6, nickname: '호대용', score: 45 },
      { id: 7, nickname: '최준숙', score: 20 },
      { id: 8, nickname: '박하멍', score: 100 },
      { id: 9, nickname: '쨈민이', score: 10 },
    ],
  },
};
