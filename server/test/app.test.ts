import "../src/@config";
import request, { SuperAgentTest } from "supertest";
import app from "../src/app";
import { connect, disconnect } from "../src/database";
import { MessageModel, UserModel } from "../src/models";
import {
  LoginParams,
  MessageResponse,
  MessagesResponse,
  UserResponse,
} from "common";
import { DocumentType } from "@typegoose/typegoose";
import { UserSchema } from "../src/models/user";
import faker from "@faker-js/faker";
import { getAvatarLink } from "../src/utils";

declare global {
  module globalThis {
    var __MONGO_URI__: string;
    var __MONGO_DB_NAME__: string;
  }
}

beforeEach(async () => {
  await connect(global.__MONGO_URI__ ?? process.env["MONGO_URL"], {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    dbName: global.__MONGO_DB_NAME__,
  });
});

afterEach(async () => {
  await UserModel.deleteMany({});
  await MessageModel.deleteMany({});
  await disconnect();
});

describe("/users", () => {
  it("POST / - create user (json)", async () => {
    await request(app)
      .post("/api/users/")
      .send({ name: "musikid" })
      .send({ mail: "musikid@outlook.com" })
      .send({ password: "thisismypassword" })
      .expect(201)
      .expect("Content-Type", /json/);
  });

  it("POST / - create user (urlencoded)", async () => {
    await request(app)
      .post("/api/users/")
      .type("form")
      .send({ name: "musikid" })
      .send({ mail: "musikid@outlook.com" })
      .send({ password: "thisismypassword" })
      .expect(201)
      .expect("Content-Type", /json/);
  });
});

describe("/friends", () => {
  let users: LoginParams[];
  let docs: DocumentType<UserSchema>[];
  let authenticatedAgent: SuperAgentTest;
  let loginUser: DocumentType<UserSchema>;

  beforeEach(async () => {
    const length = 100;
    users = Array.from({ length }, () => ({
      name: faker.internet.userName(),
      mail: faker.internet.email(),
      password: "12",
    }));

    docs = await UserModel.create(users);
    loginUser = docs[0]!;

    authenticatedAgent = request.agent(app);
    await authenticatedAgent
      .put("/api/auth/login")
      .send({ ...users[0], password: "12" })
      .expect(200);
  });

  it("GET /:uid/all - get all friends", async () => {
    const index = Math.floor(Math.random() * users.length);
    const randomUser = docs[index];

    const usersSlice = docs.slice(0, index);
    const randomCommonUser =
      usersSlice[Math.floor(Math.random() * usersSlice.length)];

    await UserModel.updateOne(
      { _id: randomUser!.id },
      { $push: { friends: usersSlice } }
    ).exec();

    await UserModel.updateOne(
      { _id: loginUser!._id },
      { $push: { friends: randomCommonUser } }
    ).exec();

    const res = await authenticatedAgent
      .get(`/api/friends/${randomUser!.id!}/all`)
      .expect(200);

    const actual = res.body;
    const expected: UserResponse[] = usersSlice.map((user) => ({
      ...(user.toJSON({
        custom: {
          isFriend: user.id === randomCommonUser!.id ? true : false,
          avatarLink: getAvatarLink(user.id!),
        },
      }) as unknown as UserResponse),
      id: user.id,
    }));

    expect(actual.users).toEqual<UserResponse[]>(
      expect.arrayContaining(expected)
    );
  });
});

describe("/messages", () => {
  let authenticatedAgent: SuperAgentTest;
  let user: DocumentType<UserSchema>;

  beforeEach(async () => {
    const bareUser = {
      name: "example",
      mail: "ex@example.com",
      password: "ex",
    };
    user = await UserModel.create(bareUser);
    authenticatedAgent = request.agent(app);
    await authenticatedAgent.put("/api/auth/login").send(bareUser).expect(200);
  });

  it("POST / - create message", async () => {
    const res = await authenticatedAgent
      .post("/api/messages")
      .send({
        content: "garbage",
      })
      .expect(201)
      .expect("Content-Type", /json/);

    const actual = res.body;
    const expected = {
      id: expect.any(String),
      author: {
        ...user.toJSON({
          custom: {
            avatarLink: expect.stringMatching(/\/avatar/),
            isFriend: false,
          },
        }),
        id: user.id,
      } as unknown as UserResponse,
      content: "garbage",
      date: expect.any(Number),
      likes: 0,
      isLiked: false,
    };

    expect(actual).toEqual<MessageResponse>(expected);
  });

  describe("GET / - get messages", () => {
    it("?uid get messages from one user", async () => {
      const fakeMessages = Array.from(
        { length: faker.datatype.number(10) },
        () => ({
          content: faker.lorem.paragraph(),
          author: user.id,
        })
      );
      const docs = await MessageModel.create(fakeMessages);

      const res = await authenticatedAgent
        .get("/api/messages")
        .query({ uid: user.id })
        .expect(200)
        .expect("Content-Type", /json/);

      const actual = res.body;
      const expected = expect.arrayContaining<MessageResponse>(
        await Promise.all(
          docs.map(async (msg) => ({
            ...((
              await msg.populate("author")
            ).toJSON({
              custom: {
                isLiked: false,
                avatarLink: expect.stringMatching(/\/avatar/),
                isFriend: false,
              },
            }) as unknown as MessageResponse),
            likes: 0,
          }))
        )
      );

      expect(actual).toEqual<MessagesResponse>(
        new MessagesResponse({ messages: expected })
      );
    });
  });
});
