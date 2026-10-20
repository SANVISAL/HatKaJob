import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  coverageDirectory: "coverage",
  collectCoverage: true,
  testPathIgnorePatterns: ["/node_modules"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  setupFiles: ["<rootDir>/jest.setup.ts"],
  testMatch: ["<rootDir>/src/**/__tests__/**/*.test.ts"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/__tests__/**",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 1,
      statements: 1,
    },
  },
  coverageReporters: ["text-summary", "lcov"],
};

export default config;
