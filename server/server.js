// Polyfill Node with `Intl` that has data for all locales.
// See: https://formatjs.io/guides/runtime-environments/#server
// import { NumberFormat, DateTimeFormat } from 'intl'
import next from 'next'
import express from 'express'
import mongoose from 'mongoose'
import glob from 'glob'
import path from 'path'
import cookieParser from 'cookie-parser'
import { Client } from 'raygun'

import setSession from './middleware/session/setSession.js'
import getAbility from './middleware/ability/getAbility.js'
import routes from './routes.js'
import config from '../config/serverConfig.js'
import { supportedLanguages } from '../lang/lang.mjs'
// import importEnv from '../config/importEncryptedEnv.mjs' // this will import during run step
import { raygunExpressServerAPIKey } from '../lib/sec/keys.mjs'
// Intl.NumberFormat = NumberFormat
// Intl.DateTimeFormat = DateTimeFormat
const { Promise: _Promise, connect, connection } = mongoose

const UPLOAD_LIMIT = '6000kb'
const server = express()
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
// server.use(bodyParser.urlencoded({ limit: UPLOAD_LIMIT, extended: true }))
// server.use(bodyParser.json({ limit: UPLOAD_LIMIT, extended: true }))
server.use(cookieParser())
server.use(setSession)
server.use(getAbility({ searchPattern: '/server/api/**/*.ability.js' }))
const routerHandler = routes.getRequestHandler(app)
const raygunClient = new Client().init({ apiKey: raygunExpressServerAPIKey })
// importEnv()

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

if (process.env.NODE_ENV === 'production') {
  const morgan = import('morgan')
  server.use(morgan('combined'))
}

// We need to load and expose the translations on the request for the user's
// locale. These will only be used in production, in dev the `defaultMessage` in
// each message description in the source code will be used.
const getMessages = locale => {
  console.log('loading language messages', locale)
  return import(`../lang/${locale}.json`)
}

const appReady = app.prepare().then(() => {
  // Parse application/x-www-form-urlencoded
  server.use(express.urlencoded({ limit: UPLOAD_LIMIT, extended: true }))
  // Parse application/json
  server.use(express.json({ limit: UPLOAD_LIMIT, extended: true }))
  server.use(function (req, res, next) {
    req.locale = req.acceptsLanguages(supportedLanguages)
    req.locale = req.locale || 'en'
    // req.localeDataScript = getLocaleDataScript(req.locale)
    req.messages = dev ? {} : getMessages(req.locale)
    // req.messages = getMessages(req.locale)
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

  // robots.txt
  if (process.env.APP_URL && process.env.APP_URL.includes('live')) {
    server.get('/robots.txt', function (req, res) {
      res.type('text/plain')
      res.send('User-agent: *\nDisallow: /api/\nDisallow:/admin/\nDisallow:/auth/')
    })
  } else {
    server.get('/robots.txt', function (req, res) {
      res.type('text/plain')
      res.send('User-agent: *\nDisallow: /')
    })
  }

  // MongoDB
  if (process.env.NODE_ENV !== 'test') {
    connect(config.databaseUrl,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })
      .then(console.log('mongodb connected'))
    const db = connection
    db.on('error', console.error.bind(console, 'connection error:'))
    // use the x/db scripts to populate a test database
  }

  // REST API routes
  const rootPath = path.join(import.meta.url, '/..')
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

export default { server, appReady }
