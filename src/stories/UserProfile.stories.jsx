import UserProfile from "../pages/UserProfile";

export default {
  title: "UserProfile",
  component: UserProfile,
};

const Template = (args) => <UserProfile {...args} />;

export const Default = Template.bind({});
Default.args = {};