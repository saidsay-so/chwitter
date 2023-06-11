# Server

The REST API documentation is generated with `express-swagger-jsdoc`.

### NOTE: All `pnpm` commands can be replaced with npm.

It needs the following environment variables (can be in a .env at the root):

- `PORT`: Server port
- `SESSION_SECRET`: Secret to use with `cookie-session`
- `MONGO_URL`: Link to MongoDB database
- `CERT`: Path/string for MongoDB certificate

## Development

```sh
pnpm run start
```

### API documentation

The API documentation is available on `/api/docs/html` and the swagger file at `/api/docs/json`.

## Build

```sh
pnpm run build
```

## Test

```sh
pnpm test
```

## Tech stack

- Mongoose/typegoose as ODM
- Express.js for server
- sharp for image processing
