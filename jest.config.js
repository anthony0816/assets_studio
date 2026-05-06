module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^translate$": "<rootDir>/test/__mocks__/translate.js",
    "^jsonwebtoken$": "<rootDir>/test/__mocks__/jsonwebtoken.js",
  },
  testMatch: ["**/test/**/*.test.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(translate)/)",
  ],
  verbose: true,
};
