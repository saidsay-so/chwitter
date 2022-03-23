import faker from "@faker-js/faker";

export const createMessage = (msg) => {};

export const deleteMessage = (id) => {};

export const getMessages = (uid, fromHimself = false) => {
  const length = Math.random() * 20 + 5;
  const placeholder = Array.from({ length }, () => ({
    id: faker.datatype.uuid(),
    message: faker.lorem.paragraph(),
    authorPicture: faker.internet.avatar(),
    author: faker.internet.userName(),
    authorId: faker.datatype.uuid(),
    authorProfileLink: "#",
    date: faker.date.recent().toISOString(),
    isFriend: faker.datatype.boolean(),
    action: (...args) => console.log(args),
  }));

  return Promise.resolve(placeholder);
};
