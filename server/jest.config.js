const jestMongoDbPreset = require("@shelf/jest-mongodb/jest-preset");

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  ...jestMongoDbPreset,
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: [".js"], // prevent duplicate tests of src/ (ts) and build/ (js)
};
