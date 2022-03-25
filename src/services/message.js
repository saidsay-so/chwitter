import faker from "@faker-js/faker";
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
    const author =
      uid === null
        ? fakeUserGen()
        : fakeUser.id === uid
        ? fakeUser
        : fakeUserProfile;

    return {
      author,
      id: faker.datatype.uuid(),
      message: faker.lorem.paragraph(),
      date: faker.date.past().toISOString(),
      action: (...args) => console.log(args),
    };
  });

  return Promise.resolve(placeholder);
};
