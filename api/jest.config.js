
module.exports = {
  preset: "ts-jest", // Use ts-jest to transpile TypeScript files
  testEnvironment: "node", // Set environment to node
  testMatch: ["**/*.test.ts"], // Only run files ending in .test.ts
  moduleFileExtensions: ["js", "ts"], // Allow Jest to process .ts and .js files
};