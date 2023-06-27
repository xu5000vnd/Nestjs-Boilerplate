module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/modules/**/*spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        'ts-jest': {
          diagnostics: {
            ignoreCodes: ['TS151001'],
          },
          tsconfig: '<rootDir>/tsconfig.build.json',
        },
      },
    ],
  }, // collectCoverage: true,
  coveragePathIgnorePatterns: [
    'node_modules',
    'enums',
    'entities',
    'interfaces',
    'dto',
    '<rootDir>/src/main.ts',
  ],
  moduleNameMapper: {
    'src/(.*)$': '<rootDir>/src/$1',
  },
  verbose: false,
  testTimeout: 100000,
}
