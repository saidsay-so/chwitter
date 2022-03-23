import faker from "@faker-js/faker";

export const areFriends = (uid1, uid2) => {};

export const getFriends = (uid, mainUid = null) => {
  const length = Math.random() * 10 + 1;
  const fakeFriends = Array.from({ length }, () => ({
    id: faker.datatype.uuid(),
    name: faker.internet.userName(),
    profileLink: "#",
    isFriend: mainUid === null ? true : areFriends(mainUid, uid),
    picture: faker.image.avatar(),
    description: faker.lorem.sentence(),
  }));

  return fakeFriends;
};
export const addFriend = (mainUid, friendUid) => {};
export const removeFriend = (mainUid, friendUid) => {};
