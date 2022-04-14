import "../src/@config";
import request, { SuperAgentTest } from "supertest";
import app from "../src/app";
import { connect, disconnect } from "../src/database";
import { MessageModel, UserModel } from "../src/models";
import { MessageResponse, MessagesResponse } from "common";
import { DocumentType } from "@typegoose/typegoose";
import { UserSchema } from "../src/models/user";
import faker from "@faker-js/faker";

declare global {
  module globalThis {
    var __MONGO_URI__: string;
    var __MONGO_DB_NAME__: string;
  }
}

beforeEach(async () => {
  await connect(global.__MONGO_URI__, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    dbName: global.__MONGO_DB_NAME__,
  });
});

afterEach(async () => {
  await UserModel.deleteMany();
  await MessageModel.deleteMany();
  await disconnect();
});

describe("/users", () => {
  it("POST / - create user (json)", async () => {
    await request(app)
      .post("/users/")
      .send({ name: "musikid" })
      .send({ mail: "musikid@outlook.com" })
      .send({ password: "thisismypassword" })
      .expect(201)
      .expect("Content-Type", /json/);
  });

  it("POST / - create user (urlencoded)", async () => {
    await request(app)
      .post("/users/")
      .type("form")
      .send({ name: "musikid" })
      .send({ mail: "musikid@outlook.com" })
      .send({ password: "thisismypassword" })
      .expect(201)
      .expect("Content-Type", /json/);
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
    await authenticatedAgent.put("/auth/login").send(bareUser).expect(200);
  });

  it("POST / - create message", async () => {
    const res = await authenticatedAgent
      .post("/messages")
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
        id: user.id!,
      },
      content: "garbage",
      date: expect.any(Number),
      likes: 0,
      isLiked: false,
    };

    expect(actual).toEqual<MessageResponse>(expected);
  });

  it("GET / - get messages from one user", async () => {
    const fakeMessages = Array.from(
      { length: faker.datatype.number(10) },
      () => ({
        content: faker.lorem.paragraph(),
        author: user.id,
      })
    );
    await MessageModel.create(fakeMessages);

    const res = await authenticatedAgent
      .get("/messages")
      .query({ uid: user.id })
      .expect(200)
      .expect("Content-Type", /json/);

    const actual = res.body;
    const expected = expect.arrayContaining<MessageResponse>(
      fakeMessages.map((msg) => ({
        ...msg,
        author: {
          ...user.toJSON({
            custom: {
              avatarLink: expect.stringMatching(/\/avatar/),
              isFriend: false,
            },
          }),
          id: user.id!,
        },
        id: expect.any(String),
        likes: 0,
        date: expect.any(Number),
        isLiked: false,
      }))
    );

    expect(actual).toEqual<MessagesResponse>(
      new MessagesResponse({ messages: expected })
    );
  });
});
