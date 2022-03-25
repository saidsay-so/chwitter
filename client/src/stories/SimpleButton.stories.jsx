import React from "react";
import "../index.css";
import SimpleButton from "../components/SimpleButton";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";

export default {
  title: "SimpleButton",
  component: SimpleButton,
  argTypes: { onClick: { action: "clicked" } },
};

const Template = (args) => <SimpleButton {...args} />;

export const Primary = Template.bind({});
Primary.args = { label: "Primary" };

export const Login = (args) => <LoginButton {...args} />;
LoginButton.args = {};

export const Logout = (args) => <LogoutButton {...args} />;
LogoutButton.args = {};
