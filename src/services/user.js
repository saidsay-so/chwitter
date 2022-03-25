import faker from "@faker-js/faker";

export const fakeUserGen = () => {
  const id = faker.datatype.uuid();

  return {
    name: faker.internet.userName(),
    profileLink: `/users/${id}`,
    picture: faker.internet.avatar(),
    description: faker.hacker.phrase(),
    id,
  };
};

export const fakeUser = fakeUserGen();

export const getUser = (id) => {
  if (id === fakeUser.id) return fakeUser;

  return fakeUserGen();
};
