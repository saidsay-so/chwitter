import React from "react";
import "../index.css";
import SimpleButton from "../components/SimpleButton";

export default {
  title: "SimpleButton",
  component: SimpleButton,
  argTypes: { onClick: { action: 'clicked' } },
};

const Template = (args) => <SimpleButton {...args} />;

export const Primary = Template.bind({});
Primary.args = { label: "Primary" };