import React from "react";
import "../index.css";
import User from "../components/User";

export default {
  title: "User",
  component: User,
};

const Template = (args) => <User {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  name: "John",
  picture:
    "http://images.guff.com/gallery/image/screen-shot-2015-09-07-at-151108",
  description: "A cute doggo",
};
