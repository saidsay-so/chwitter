import React from "react";
import Input from "../components/Input";

export default {
  title: "Input",
  component: Input,
  argTypes: { listener: { action: "New input" } },
};

const Template = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = { name: "test", label: "E-mail" };
