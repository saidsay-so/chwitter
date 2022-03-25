import MessagesList from "../components/MessagesList";

export default {
  title: "MessagesList",
  component: MessagesList,
};

const messages = [
  {
    message: "This is a message",
    authorPicture:
      "http://images.guff.com/gallery/image/screen-shot-2015-09-07-at-151108",
    author: "John",
    authorProfileLink: "#",
    date: "12 Jun 2021",
    isFriend: false,
    action: (...args) => console.log(args),
  },
  {
    message: "This is a message",
    authorPicture:
      "http://images.guff.com/gallery/image/screen-shot-2015-09-07-at-151108",
    author: "Not John",
    authorProfileLink: "#",
    date: "12 Jun 2021",
    isFriend: true,
    action: (...args) => console.log(args),

  },
];

const Template = (args) => <MessagesList {...args} />;

export const Default = Template.bind({});
Default.args = { messages };
