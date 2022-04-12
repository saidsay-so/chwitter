export class UserResponse {
  id!: string;
  name!: string;
  mail?: string;
  displayName!: string;
  avatarLink!: string;
  isFriend!: boolean;
  description!: string;

  constructor({
    _id,
    name,
    mail,
    displayName,
    avatarLink,
    isFriend,
    description,
  }: {
    _id: string;
    name: string;
    mail: string;
    displayName: string;
    avatarLink: string;
    isFriend: boolean;
    description: string;
  }) {
    this.id = _id;
    this.name = name;
    this.mail = mail;
    this.displayName = displayName;
    this.avatarLink = avatarLink;
    this.isFriend = isFriend;
    this.description = description;
  }
}

export class UpdateUserParams {
  name?: string;
  mail?: string;
  avatar?: File;
  password?: string;
  displayName?: string;
  description?: string;
}
