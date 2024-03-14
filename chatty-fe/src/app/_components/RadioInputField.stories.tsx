import { Meta, StoryObj } from '@storybook/react';
import RadioInputField from './RadioInputField';

type Option = {
  value: string;
  label: string;
};

const options: Option[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
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
    selectedValue: 'option1', // Default selected value for the story
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInitialValue: Story = {
  args: {
    selectedValue: 'option2', // Initial selected value different than default
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
      { value: 'custom1', label: 'Custom 1' },
      { value: 'custom2', label: 'Custom 2' },
    ],
    selectedValue: 'custom1',
  },
};

// Optionally, you could add decorators or other configurations specific to the RadioInputField
