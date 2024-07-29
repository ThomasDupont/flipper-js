/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!@yourproject)'
  ],
  modulePathIgnorePatterns: ["<rootDir>/dist/"]
}
