// Polyfill Node with `Intl` that has data for all locales.
// See: https://formatjs.io/guides/runtime-environments/#server
const IntlPolyfill = require('intl')
Intl.NumberFormat = IntlPolyfill.NumberFormat
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat

const { readFileSync } = require('fs')
const { basename } = require('path')

require('dotenv').config()
const express = require('express')

const server = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const glob = require('glob')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })

const routes = require('./routes')
const routerHandler = routes.getRequestHandler(app)
const initialOrganisations = require('./models/organisation.dummy')

const { config } = require('../config/config')

// Get the supported languages by looking for translations in the `lang/` dir.
const supportedLanguages = glob
  .sync('./lang/*.json')
  .map(f => basename(f, '.json'))

// We need to expose React Intl's locale data on the request for the user's
// locale. This function will also cache the scripts by lang in memory.
const localeDataCache = new Map()
const getLocaleDataScript = locale => {
  // const lang = locale.split('-')[0]
  const lang = locale
  if (!localeDataCache.has(lang)) {
    const localeDataFile = require.resolve(`react-intl/locale-data/${lang}`)
    const localeDataScript = readFileSync(localeDataFile, 'utf8')
    localeDataCache.set(lang, localeDataScript)
  }
  return localeDataCache.get(lang)
}

// We need to load and expose the translations on the request for the user's
// locale. These will only be used in production, in dev the `defaultMessage` in
// each message description in the source code will be used.
const getMessages = locale => {
  return require(`../lang/${locale}.json`)
}

app.prepare().then(() => {
  // Parse application/x-www-form-urlencoded
  server.use(bodyParser.urlencoded({ extended: false }))
  // Parse application/json
  server.use(bodyParser.json())

  server.use(function (req, res, next) {
    req.locale = req.acceptsLanguages('mi', 'fr', 'en')
    req.localeDataScript = getLocaleDataScript(req.locale)
    // req.messages = dev ? {} : getMessages(req.locale)
    req.messages = getMessages(req.locale)
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
    mongoose.connect(config.databaseUrl, { useNewUrlParser: true })
    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'connection error:'))

    initialOrganisations()
  }

  // REST API routes
  const rootPath = require('path').join(__dirname, '/..')
  glob.sync(rootPath + '/server/api/*.js').forEach(controllerPath => {
    if (!controllerPath.includes('.test.js')) require(controllerPath)(server)
  })

  // Next.js page routes
  server.get('*', routerHandler)

  // Start server
  server.listen(config.serverPort, () => console.log(`${config.appName} running on http://localhost:${config.serverPort}/ Be Awesome`))
})
