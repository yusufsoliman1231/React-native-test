module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: [
    "<rootDir>/src/__tests__/jest.setup.js",
    "<rootDir>/src/__tests__/setup.ts",
  ],
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|expo|@expo|react-navigation|@react-navigation|expo-modules-core|expo-asset|expo-constants|expo-font|expo-splash-screen|expo-status-bar|expo-system-ui|expo-web-browser|react-redux|@reduxjs/toolkit|immer)/)",
  ],
};
