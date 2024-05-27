import { Meta, StoryObj } from '@storybook/react';
import UserGrid from './UserGrid';

const meta = {
  title: 'Components/UserGrid',
  component: UserGrid,
} satisfies Meta<typeof UserGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    submitStatus: [
      {
        userId: 7,
        profileImage: '/images/profile.svg',
        nickname: '1',
        isSolved: true,
      },
      {
        userId: 8,
        profileImage: null,
        nickname: '2',
        isSolved: false,
      },
      {
        userId: 8,
        profileImage: '/images/profile.svg',
        nickname: '2',
        isSolved: true,
      },
      {
        userId: 8,
        profileImage: '/images/profile.svg',
        nickname: '2',
        isSolved: false,
      },
      {
        userId: 8,
        profileImage: '/images/profile.svg',
        nickname: '2',
        isSolved: false,
      },
      {
        userId: 8,
        profileImage: '/images/profile.svg',
        nickname: '2',
        isSolved: false,
      },
      {
        userId: 8,
        profileImage: '/images/profile.svg',
        nickname: '2',
        isSolved: false,
      },
      {
        userId: 8,
        profileImage: '/images/profile.svg',
        nickname: '2',
        isSolved: false,
      },
    ],
  },
};
