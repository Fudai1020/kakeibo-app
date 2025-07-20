module.exports = {
  // 既存の設定はそのまま
  roots: ["<rootDir>/src/pages/tests"],
  testMatch: ['**/*.test.ts?(x)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'jsdom',

  // ここを追加
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
