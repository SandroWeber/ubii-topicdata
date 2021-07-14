export default {
  files: [
    'test/**/*',
    // not part of the tests
    '!test/utility.js',
  ],
  cache: false,
  failFast: true,
  failWithoutAssertions: false,
  tap: false,
  verbose: true,
  serial: true,
  babel: {
    compileEnhancements: false,
  },
};
