import faker from "@faker-js/faker";
import { areFriends } from "./friend";
import { fakeUser, fakeUserGen } from "./user";

export const createMessage = (uid, msg) => {
  console.log(`Message from ${uid}: ${msg}`);
};

export const deleteMessage = (uid, id) => {
  console.log(`Delete message ${id} for user ${uid}`);
};

export const getMessages = (uid = null, fromHimself = false) => {
  const length = Math.random() * 20 + 5;

  const fakeUserProfile = fakeUserGen();

  const placeholder = Array.from({ length }, () => {
    const author = {};
    const fakeUser = uid === null ? fakeUserGen() : fakeUserProfile;
    for (const [prop, val] of Object.entries(fakeUser)) {
      const propName = prop.charAt(0).toUpperCase() + prop.slice(1);
      author[`author${propName}`] = val;
    }

    return {
      ...author,
      id: faker.datatype.uuid(),
      message: faker.lorem.paragraph(),
      author: fakeUser.name,
      date: faker.date.past().toISOString(),
      action: (...args) => console.log(args),
    };
  });

  return Promise.resolve(placeholder);
};
