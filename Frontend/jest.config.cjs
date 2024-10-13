module.exports = {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  moduleFileExtensions: ["js", "jsx"],
  transformIgnorePatterns: [
    "/node_modules/(?!axios)"
  ]
};