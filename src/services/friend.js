import faker from "@faker-js/faker";
import { fakeUserGen } from "./user";

export const areFriends = (uid1, uid2) => {
  if (uid1 === uid2) return false;

  return faker.datatype.boolean();
};

export const getFriends = (uid, mainUid = null) => {
  const length = Math.random() * 10 + 1;
  const fakeFriends = Array.from({ length }, fakeUserGen);

  return Promise.resolve(fakeFriends);
};
export const addFriend = (mainUid, friendUid) => {};
export const removeFriend = (mainUid, friendUid) => {};
