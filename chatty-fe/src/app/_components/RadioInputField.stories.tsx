import { Meta, StoryObj } from '@storybook/react';
import RadioInputField from './RadioInputField';

type Option = {
  id: string;
  value: string;
  label: string;
};

const options: Option[] = [
  { id: 'option1', value: 'option1', label: 'Option 1' },
  { id: 'option2', value: 'option2', label: 'Option 2' },
  { id: 'option3', value: 'option3', label: 'Option 3' },
];

const meta: Meta<typeof RadioInputField> = {
  title: 'Components/RadioInputField',
  component: RadioInputField,
  argTypes: {
    selectedValue: {
      control: 'radio',
      options: options.map((option) => option.value),
    },
    onChange: { action: 'changed' },
  },
  args: {
    name: 'exampleRadio',
    options: options,
    selectedValue: 'option1',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInitialValue: Story = {
  args: {
    selectedValue: 'option2',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '200px' }}>
        <Story />
      </div>
    ),
  ],
};

export const CustomOptions: Story = {
  args: {
    options: [
      { id: 'custom1', value: 'custom1', label: 'Custom 1' },
      { id: 'custom2', value: 'custom2', label: 'Custom 2' },
    ],
    selectedValue: 'custom1',
  },
};
