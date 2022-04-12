export class AddFriendResponse {}

export class GetFriendResponse {
  isFriend!: boolean;

  constructor({ isFriend }: { isFriend: boolean }) {
    this.isFriend = isFriend;
  }
}
