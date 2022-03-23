import faker from "@faker-js/faker";

export const getUser = (id) => {
  const placeholder = {
    name: "Not John",
    profileLink: "/users/1",
    picture:
      "https://hddesktopwallpapers.in/wp-content/uploads/2015/09/wildlife-picture.jpg",
    id: 1,
    description: faker.hacker.phrase(),
  };

  return placeholder;
};
