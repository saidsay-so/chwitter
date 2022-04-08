import faker from "@faker-js/faker";
import { Message as ServerMessageResponse } from "common";
import { fakeUser, fakeUserGen, User } from "./user";

export interface Message extends ServerMessageResponse {
  author: User;
}

export const createMessage = (uid: User["id"], msg: string) => {
  console.log(`Message from ${uid}: ${msg}`);
};

export const deleteMessage = (uid: User["id"], id: any) => {
  console.log(`Delete message ${id} for user ${uid}`);
};

export const changeLikeStateMessage = (
  mainUid: User["id"],
  messageId: Message["id"]
) => {};

export const getMessages = (
  uid?: string,
  fromHimself = false
): Promise<Message[]> => {
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
      content: faker.lorem.paragraph(),
      likes: faker.datatype.number(),
      date: faker.date.past().getTime(),
      action: (...args: any[]) => console.log(args),
    };
  });

  return Promise.resolve(placeholder);
};
