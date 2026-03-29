import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardHeader, CardContent } from '../components/design-system/Card';

const meta = {
  title: 'Design System/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <CardHeader>
          <h3 className="text-lg font-semibold">Card Title</h3>
        </CardHeader>
        <CardContent>
          <p>This is the card content area.</p>
        </CardContent>
      </>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <CardHeader>
          <h3 className="text-lg font-semibold">Elevated Card</h3>
        </CardHeader>
        <CardContent>
          <p>This card has elevation shadow.</p>
        </CardContent>
      </>
    ),
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: (
      <>
        <CardHeader>
          <h3 className="text-lg font-semibold">Outlined Card</h3>
        </CardHeader>
        <CardContent>
          <p>This card has a thick outline.</p>
        </CardContent>
      </>
    ),
  },
};