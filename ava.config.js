export default {
  files: [
    '__tests__/**/*.spec.js',
    'server/**/__tests__/*.spec.js',
    'components/**/__tests__/*.spec.js',
    'lib/**/__tests__/*.spec.js'
  ],
  failFast: false,
  timeout: '2m',
  babel: {
    testOptions: {
      retainLines: true,
      plugins: [
        '@babel/plugin-syntax-jsx'
      ],
      presets: [
        'next/babel'
      ]
    }
  },
  require: [
    './server/util/setup-test-env.js'
  ]
}
