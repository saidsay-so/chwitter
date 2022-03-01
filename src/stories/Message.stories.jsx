import React from "react";
import "../index.css";
import Message from "../components/Message";

export default {
  title: "Message",
  component: Message,
  argTypes: { addAuthor: { action: "Add author to friends" } },
};

const Template = (args) => <Message {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  message: "This is a message",
  author: "John",
  authorProfileLink: "#",
  authorPicture:
    "http://images.guff.com/gallery/image/screen-shot-2015-09-07-at-151108",
  authorId: "John",
  date: "12 Jun 2021",
};
