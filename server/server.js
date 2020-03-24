// Polyfill Node with `Intl` that has data for all locales.
// See: https://formatjs.io/guides/runtime-environments/#server
const IntlPolyfill = require('intl')
Intl.NumberFormat = IntlPolyfill.NumberFormat
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat

const UPLOAD_LIMIT = '6000kb'
require('dotenv').config()
const express = require('express')
const server = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const glob = require('glob')
const next = require('next')
const cookieParser = require('cookie-parser')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const setSession = require('./middleware/session/setSession')
const getAbility = require('./middleware/ability/getAbility')
// server.use(bodyParser.urlencoded({ limit: UPLOAD_LIMIT, extended: true }))
// server.use(bodyParser.json({ limit: UPLOAD_LIMIT, extended: true }))
server.use(cookieParser())
server.use(setSession)
server.use(getAbility({ searchPattern: '/server/api/**/*.ability.js' }))
const routes = require('./routes')
const routerHandler = routes.getRequestHandler(app)
const { config } = require('../config/serverConfig')
const { supportedLanguages } = require('../lang/lang')

const { raygunExpressServerAPIKey } = require('../lib/sec/keys')
const raygun = require('raygun')
const raygunClient = new raygun.Client().init({ apiKey: raygunExpressServerAPIKey })

raygunClient.excludedHostNames = ['localhost']
raygunClient.user = function (req) {
  if (req.person) {
    return {
      identifier: req.person.nickname + req.person.email,
      email: req.person.email,
      fullName: req.person.name
    }
  }
}

// We need to expose React Intl's locale data on the request for the user's
// locale. This function will also cache the scripts by lang in memory.
// const localeDataCache = new Map()
// const getLocaleDataScript = locale => {
//   // const lang = locale.split('-')[0]
//   const lang = locale || 'en'
//   if (!localeDataCache.has(lang)) {
//     const localeDataFile = require.resolve(`react-intl/locale-data/${lang}`)
//     const localeDataScript = readFileSync(localeDataFile, 'utf8')
//     localeDataCache.set(lang, localeDataScript)
//   }
//   return localeDataCache.get(lang)
// }

// We need to load and expose the translations on the request for the user's
// locale. These will only be used in production, in dev the `defaultMessage` in
// each message description in the source code will be used.
const getMessages = locale => {
  return require(`../lang/${locale}.json`)
}

const appReady = app.prepare().then(() => {
  // Parse application/x-www-form-urlencoded
  server.use(bodyParser.urlencoded({ limit: UPLOAD_LIMIT, extended: true }))
  // Parse application/json
  server.use(bodyParser.json({ limit: UPLOAD_LIMIT, extended: true }))
  server.use(function (req, res, next) {
    req.locale = req.acceptsLanguages(supportedLanguages)
    req.locale = req.locale || 'en'
    // req.localeDataScript = getLocaleDataScript(req.locale)
    // req.messages = dev ? {} : getMessages(req.locale)
    req.messages = getMessages(req.locale)
    // const { gitDescribeSync } = require('git-describe')
    // const gitInfo = gitDescribeSync()
    // req.messages.revision = process.env.REVISION || gitInfo.raw
    req.messages.revision = process.env.REVISION
    req.messages.notice = process.env.NOTICE
    next()
  })

  // Allows for cross origin domain request:
  server.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })

  // MongoDB
  mongoose.Promise = Promise
  if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(config.databaseUrl,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })
      .then(console.log('mongodb connected'))
    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'connection error:'))
    // use the x/db scripts to populate a test database
  }

  // REST API routes
  const rootPath = require('path').join(__dirname, '/..')
  glob.sync(rootPath + '/server/api/**/*.routes.js').forEach(controllerPath => {
    if (!controllerPath.includes('.spec.js')) require(controllerPath)(server)
  })

  // Load all Subscriptions
  glob.sync(rootPath + '/server/api/**/*.subscribe.js').forEach(sub => {
    if (!sub.includes('.spec.js')) require(sub)(server)
  })
  // Next.js page routes
  server.get('*', routerHandler)
  // Start server
  if (process.env.NODE_ENV !== 'test') {
    server.use(raygunClient.expressHandler)
    server.listen(config.serverPort, () =>
      console.log(`${config.appName} (${process.env.REVISION || 'local_build'}) running on ${config.appUrl} ${config.env}/ Be Awesome`))
  } else {
    console.log(`${config.appName} (${process.env.REVISION || 'local_build'}) ${config.env}/ Be Testy`)
  }
})

module.exports = { server, appReady }
