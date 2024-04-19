import { Meta, StoryObj } from '@storybook/react';
import Modal from './Modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  argTypes: {
    isOpen: { control: 'boolean' },
    onClose: { action: 'closed' },
    children: { control: 'text' },
    timerSec: { control: 'number' },
    closeButton: { control: 'boolean' },
    closeBlocked: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div
        id="modal-root"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          display: 'flex',
          width: '100%',
          border: '50px solid rgba(0, 0, 0, 0.5)',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    children: 'Modal Content',
  },
};

export const Timer: Story = {
  args: {
    isOpen: true,
    children: 'Timer Modal Content',
    timerSec: 10,
  },
};

export const CloseButton: Story = {
  args: {
    isOpen: true,
    children: 'None Button Modal Content',
    closeButton: false,
  },
};

export const CloseBlocked: Story = {
  args: {
    isOpen: true,
    children: 'Close Blocked Modal Content',
    closeBlocked: true,
  },
};
