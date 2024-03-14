import { Meta, StoryObj } from '@storybook/react';
import InputField from './TextInputField';

const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
  argTypes: {
    placeholder: { control: 'text' },
    borderRadius: { control: 'number' },
    backgroundColor: { control: 'color' },
    isChat: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '200px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Rounded: Story = {
  args: {
    placeholder: 'Enter text...',
    borderRadius: 12,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export const ChattingField: Story = {
  args: {
    placeholder: '채팅 보내기',
    isChat: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '1300px' }}>
        <Story />
      </div>
    ),
  ],
};
