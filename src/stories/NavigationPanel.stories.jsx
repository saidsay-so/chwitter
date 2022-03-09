import React from "react";
import NavigationPanel from "../components/NavigationPanel";

export default {
  title: "NavigationPanel",
  component: NavigationPanel,
  argTypes: { action: { action: "Connect" } },
};

const Template = (args) => <NavigationPanel {...args} />;

export const Default = Template.bind({});
Default.args = {
  page: "Page",
  isConnected: false,
  name: "Not John",
  profileLink: "#",
  picture:
    "https://hddesktopwallpapers.in/wp-content/uploads/2015/09/wildlife-picture.jpg",
};
