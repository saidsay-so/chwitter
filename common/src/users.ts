import { UserResponse } from "./user";

export class UsersResponse {
  users: UserResponse[];

  constructor({ users }: { users: UserResponse[] }) {
    this.users = users;
  }
}
