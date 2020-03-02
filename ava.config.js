const NPM_RUN_TARGET = process.env.npm_lifecycle_event

const COMMON_CONFIG = {
  verbose: true,
  files: [
    '__tests__/**/*.spec.js',
    'server/**/__tests__/*.spec.js',
    'components/**/__tests__/*.spec.js',
    'lib/**/__tests__/*.spec.js'
  ],
  helpers: [
    '**/__tests__/**/*.fixture.js',
    'lib/react-intl-test*.js'
  ],
  sources: [
    'components/**/*.js',
    'hocs/**/*.js',
    'lib/**/*.js',
    'pages/**/*.js',
    'server/**/*.js'
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

const AVA_CONFIGS = {
  'test-components': {
    ...COMMON_CONFIG,
    files: [
      'components/**/__tests__/*.spec.js'
    ]
  },
  'test-lib': {
    ...COMMON_CONFIG,
    files: [
      'lib/**/__tests__/*.spec.js'
    ]
  },
  'test-pages': {
    ...COMMON_CONFIG,
    files: [
      '__tests__/**/*.spec.js'
    ]
  },
  'test-server': {
    ...COMMON_CONFIG,
    files: [
      'server/**/__tests__/*.spec.js'
    ]
  }
}

const defaultConfig = {
  ...COMMON_CONFIG
}

export default AVA_CONFIGS[NPM_RUN_TARGET] || defaultConfig
