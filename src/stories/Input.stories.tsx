import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '../components/design-system/Input';

const meta = {
  title: 'Design System/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    label: 'Text Input',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter email...',
    label: 'Email Input',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
    label: 'Password Input',
  },
};

export const WithError: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    label: 'Input with Error',
    error: 'This field is required',
  },
};