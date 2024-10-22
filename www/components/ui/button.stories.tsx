import type { Meta, StoryObj } from "@storybook/react";

import { CandyButton, buttonVariants } from "./button";

const meta = {
  component: CandyButton,
} satisfies Meta<typeof CandyButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // render: (args) => <Button {...args}>Button</Button>,
  args: {
    // variant: "candy",
    children: "Button text is here",
  },
};
