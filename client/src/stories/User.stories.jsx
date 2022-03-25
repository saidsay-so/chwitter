import React from "react";
import "../index.css";
import User from "../components/User";

export default {
  title: "User",
  component: User,
  argTypes: { action: { action: "clicked" } },
};

const Template = (args) => <User {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  name: "John",
  profileLink: "#",
  isFriend: false,
  picture:
    "http://images.guff.com/gallery/image/screen-shot-2015-09-07-at-151108",
  description: "A cute doggo",
};


export const Friend = Template.bind({});
Friend.args = {
  name: "John",
  profileLink: "#",
  isFriend: true,
  picture:
    "http://images.guff.com/gallery/image/screen-shot-2015-09-07-at-151108",
  description: "A cute doggo",
};
