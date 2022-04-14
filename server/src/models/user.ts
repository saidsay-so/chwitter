import {
  pre,
  prop,
  Ref,
  DocumentType,
  ReturnModelType,
  index,
} from "@typegoose/typegoose";
import { AuthError, AuthErrorType } from "../errors";
import { hash } from "../utils";
import { MessageSchema } from "./message";

@pre("save", async function (this: DocumentType<UserSchema>) {
  const buffer = await hash(this.password.normalize(), this.id, 128);
  this.password = buffer.toString("hex");
})
@index({ name: "text", displayName: "text" })
export class UserSchema {
  @prop({
    required: true,
    minlength: 1,
    maxlength: 32,
    match: /^\S+$/,
    trim: true,
    index: true,
    unique: true,
  })
  name!: string;

  @prop({
    required: true,
    match: /^\S+@\S+\.\S+$/,
    trim: true,
    index: true,
    unique: true,
  })
  mail!: string;

  @prop({ required: true })
  password!: string;

  @prop({
    default: "Sans Titre",
    trim: true,
    minlength: 1,
    maxlength: 64,
  })
  displayName!: string;

  @prop()
  avatar?: Buffer;

  @prop({ default: "Bienvenue sur ma page !" })
  description!: string;

  // @prop({ localField: "_id", foreignField: "author", ref: () => MessageSchema })
  // messages?: Ref<MessageSchema>[];

  @prop({ ref: () => MessageSchema })
  likedMessages?: Ref<MessageSchema>[];

  @prop({ ref: () => UserSchema })
  friends?: Ref<UserSchema>[];

  static async findUserLogin(
    this: ReturnModelType<typeof UserSchema>,
    mail: string,
    password: string
  ): Promise<DocumentType<UserSchema>> {
    if (!mail || !password)
      throw new AuthError(AuthErrorType.EMPTY_INFORMATION);

    const user = await this.findOne({ mail }).exec();
    if (user === null) throw new AuthError(AuthErrorType.UNKNOWN_USER);

    if (!user.verifyPassword(password))
      throw new AuthError(AuthErrorType.INVALID_PASSWORD);

    return user;
  }

  static findByName(this: ReturnModelType<typeof UserSchema>, name: string) {
    return this.find({ name });
  }

  async verifyPassword(
    this: DocumentType<UserSchema>,
    password: string
  ): Promise<boolean> {
    const buffer = await hash(password.normalize(), this.id, 128);
    return this.password === buffer.toString("hex");
  }
}
