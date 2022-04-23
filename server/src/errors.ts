export class ChwitterError extends Error {}

export const enum AuthErrorType {
  UNKNOWN_USER = "UnknownUser",
  EMPTY_INFORMATION = "EmptyInfo",
  INVALID_PASSWORD = "InvalidPassword",
}

const AuthErrorMessages = {
  [AuthErrorType.UNKNOWN_USER]: "User does not exist",
  [AuthErrorType.EMPTY_INFORMATION]: "Missing name/password",
  [AuthErrorType.INVALID_PASSWORD]: "Passsword is incorrect",
};

export class AuthError extends ChwitterError {
  constructor(type: AuthErrorType) {
    super(AuthErrorMessages[type]);
    this.name = type;
  }
}
