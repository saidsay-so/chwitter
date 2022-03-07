import React from "react";
import NavigationPanel from "../components/NavigationPanel";

export default {
    title: "NavigationPanel",
    component: NavigationPanel, 
}

const Template = (args) => <NavigationPanel {...args} />;

export const Default = Template.bind({});
Default.args = {};