import UserProfile from "../pages/UserProfile";

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

const user = {
  name: "John",
  profileLink: "#",
  isFriend: false,
  picture:
    "http://images.guff.com/gallery/image/screen-shot-2015-09-07-at-151108",
  description: "A cute doggo",
};

export default {
  title: "UserProfile",
  component: UserProfile,
};

const Template = (args) => <UserProfile {...args} />;

const friendAction = console.log;

export const Default = Template.bind({});
Default.args = {
  messages,
  user,
  friendAction,
};
