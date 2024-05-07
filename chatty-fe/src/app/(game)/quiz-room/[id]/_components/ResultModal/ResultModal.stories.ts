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
      { playerId: 1, nickname: '박규연', score: 30 },
      { playerId: 2, nickname: '김우림', score: 70 },
      { playerId: 3, nickname: '배준형', score: 999 },
      { playerId: 4, nickname: '안금장', score: 70 },
      { playerId: 6, nickname: '호대용', score: 45 },
      { playerId: 7, nickname: '최준숙', score: 20 },
      { playerId: 8, nickname: '박하멍', score: 100 },
      { playerId: 9, nickname: '쨈민이', score: 10 },
    ],
    count: 10,
  },
};
