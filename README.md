# Chwitter

## Twitter, but it's lame.

[![Test](https://github.com/musikid/chwitter/actions/workflows/test.yml/badge.svg)](https://github.com/musikid/chwitter/actions/workflows/test.yml)

![Logo](./assets/logo.svg?h=96)

---

## API documentation

https://musikid.github.io/chwitter/api/docs/html

## Build

Build instructions are available for each package.

### Due to [#10695](https://github.com/facebook/create-react-app/issues/10695), the `common` package needs to be built manually.

```sh
cd common
pnpm build
```

### Docker

```sh
docker build . -t musikid/chwitter
```

## Status

The project is complete.

## Features

- Likes
- Search function
- Add/remove friends
- Create/remove messages
- Light/Dark mode
- Edit profile

## Highlights

### Responsive

|                    | Mobile                                                    | Desktop                                                    |
| ------------------ | --------------------------------------------------------- | ---------------------------------------------------------- |
| Login              | ![login](assets/screenshots/login-mobile.jpg)             | ![login](assets/screenshots/login-desktop.jpg)             |
| Home Feed          | ![home](assets/screenshots/home-mobile.jpg)               | ![home](assets/screenshots/home-desktop.jpg)               |
| Profile - Messages | ![messages](assets/screenshots/profile-msg-mobile.jpg)    | ![messages](assets/screenshots/profile-msg-desktop.jpg)    |
| Profile - Friends  | ![friends](assets/screenshots/profile-friends-mobile.jpg) | ![friends](assets/screenshots/profile-friends-desktop.jpg) |

### Minimal

React, dayjs and classnames are the only dependencies for the client,
Express and mongoose/typegoose for the server.

## FAQ

### Why?

Because school.

### Will it work one day?

Not gonna make it for production.
