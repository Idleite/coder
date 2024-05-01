import type { Meta, StoryObj } from "@storybook/react";
import { NotificationBannerView } from "./NotificationBannerView";

const meta: Meta<typeof NotificationBannerView> = {
  title: "modules/dashboard/NotificationBannerView",
  component: NotificationBannerView,
};

export default meta;
type Story = StoryObj<typeof NotificationBannerView>;

export const Production: Story = {
  args: {
    message: "weeeee",
    backgroundColor: "#FFFFFF",
  },
};

export const Preview: Story = {
  args: {
    message: "weeeee",
    backgroundColor: "#000000",
  },
};
