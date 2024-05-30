import { Meta, StoryObj } from '@storybook/react';
import ResultPageModal from './ResultPageModal';

const meta = {
  title: 'Components/ResultPageModal',
  component: ResultPageModal,
} satisfies Meta<typeof ResultPageModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    results: [
      {
        quizNumber: 1,
        quiz: 'test',
        options: ['test', 'test', 'test', 'test'],
        correct: 'test',
        playerAnswers: [
          {
            playerId: 1,
            nickname: 'test',
            playerAnswer: 'test',
            marking: true,
            profileImage: null,
          },
          {
            playerId: 2,
            nickname: 'test',
            playerAnswer: 'test',
            marking: false,
            profileImage: null,
          },
        ],
        correctRate: 45,
      },
    ],
    currentQuizNumber: 1,
    closeModal: () => {},
  },
};
