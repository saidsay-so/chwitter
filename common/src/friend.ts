export class AddFriendResponse {}

export class GetFriendStateResponse {
  isFriend!: boolean;

  constructor({ isFriend }: { isFriend: boolean }) {
    this.isFriend = isFriend;
  }
}
