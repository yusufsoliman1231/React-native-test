// Mock expo winter runtime before anything else
global.__ExpoImportMetaRegistry = {};

// Add structuredClone polyfill for Node.js < 17
if (!global.structuredClone) {
  global.structuredClone = (val) => JSON.parse(JSON.stringify(val));
}

// Mock expo modules
jest.mock("expo", () => ({}));
jest.mock("expo/src/winter/runtime.native", () => ({}));
jest.mock("expo/src/winter/installGlobal", () => ({}));
