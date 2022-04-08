import faker from "@faker-js/faker";
import { fakeUserGen } from "./user";

export const areFriends = (uid1: string, uid2: string) => {
  if (uid1 === uid2) return Promise.resolve(false);

  return Promise.resolve(faker.datatype.boolean());
};

export const getFriends = (uid: string, mainUid?: string) => {
  const length = Math.random() * 10 + 1;
  const fakeFriends = Array.from({ length }, fakeUserGen);

  return Promise.resolve(fakeFriends);
};

export const addFriend = (mainUid: string, friendUid: string) => {};
export const removeFriend = (mainUid: string, friendUid: string) => {};
