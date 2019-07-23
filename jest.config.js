module.exports = {
  collectCoverageFrom: ['app/render/**/*.js', '!app/render/**/*.test.js'],
  cacheDirectory: '<rootDir>/.test_cache',
  moduleNameMapper: {
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '.+\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFilesAfterEnv: ['<rootDir>/testHelper/testSetup.js'],
  testRegex: '__tests__/.*\\.test\\.js$',
};
