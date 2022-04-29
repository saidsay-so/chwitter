# Structure de la base de données

## Messages

```ts
export class MessageSchema extends BaseDocument {
  @prop({ required: true, ref: () => UserSchema })
  author!: Ref<UserSchema>;

  @prop({ required: true, minlength: 8, maxlength: 320 })
  content!: string;

  @prop({ default: 0, min: 0 })
  likes!: number;
}
```

## Utilisateurs

```ts
export class UserSchema {
  @prop({
    required: true,
    minlength: 1,
    maxlength: 32,
    match: /^[a-z_0-9]+$/,
    trim: true,
    index: true,
    unique: true,
  })
  name!: string;

  @prop({ required: true })
  password!: string;

  @prop({
    default: "Sans Titre",
    trim: true,
    minlength: 1,
    maxlength: 16,
    match: /^[^@]+$/
  })
  displayName!: string;

  @prop()
  avatar?: Buffer;

  @prop({ default: "Bienvenue sur ma page !", maxlength: 64 })
  description!: string;

  // @prop({ localField: "_id", foreignField: "author", ref: () => MessageSchema })
  // messages?: Ref<MessageSchema>[];

  @prop({ ref: () => MessageSchema })
  likedMessages?: Ref<MessageSchema>[];

  @prop({ ref: () => UserSchema })
  friends?: Ref<UserSchema>[];
```
