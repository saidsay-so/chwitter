import faker from "@faker-js/faker";
import { User as ServerUserResponse } from "common";

export interface User extends ServerUserResponse {
  profileLink: string;
}

export const fakeUserGen = () => {
  const id = faker.datatype.uuid();

  return {
    name: faker.internet.userName(),
    displayName: faker.name.findName(),
    profileLink: `/users/${id}`,
    avatarLink: faker.internet.avatar(),
    description: faker.hacker.phrase(),
    messagesCount: faker.datatype.number({ min: 10, max: 3000 }),
    friendsCount: faker.datatype.number({ min: 10, max: 3000 }),
    id,
  };
};

export const fakeUser = fakeUserGen();

export const getUser = (id: string) => {
  if (id === fakeUser.id) return fakeUser;

  return fakeUserGen();
};
