import React from "react";
import "../index.css";
import SimpleButton from "../components/SimpleButton";

export default {
  title: "SimpleButton",
  component: SimpleButton,
  argTypes: { onClick: { action: 'clicked' } },
};

const Template = (args) => <SimpleButton {...args} />;

export const Logout = Template.bind({});
Logout.args = { className: "logout", label: "Se déconnecter" };

export const Login = Template.bind({});
Login.args = { className: "login", label: "Se connecter" };