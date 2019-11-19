const nodemailer = require('nodemailer')
const nodemailerMock = require('nodemailer-mock')

const { config } = require('../../../config/config')

// const getTransportTest = () => {
//   // Generate test SMTP service account from ethereal.email
//   // Only needed if you don't have a real mail account for testing
//   return nodemailer.createTestAccount()
//     .then(testAccount => {
//       return nodemailer.createTransport({
//         host: 'smtp.ethereal.email',
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//           user: testAccount.user, // generated ethereal user
//           pass: testAccount.pass // generated ethereal password
//         }
//       })
//     })
// }

const getTransportDev = () =>
  nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'emma.lockman76@ethereal.email', // If the email is not sent, just need to get on the website and create a new account
      pass: 'CzBhFBWqHqGkZVvDFH'
    }
  })

// Use AWS SMTP service
// for ses-smtp-user.20190425-160307
// from must be andrew@voluntarily.nz
// to must be registered emails until we get out of the sandbox
const getTransportSES = () =>
  nodemailer.createTransport({
    host: 'email-smtp.us-west-2.amazonaws.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: config.SMTP_ID,
      pass: config.SMTP_PWD
    }
  })

const getTransportMock = () =>
  nodemailerMock.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'emma.lockman76@ethereal.email', // If the email is not sent, just need to get on the website and create a new account
      pass: 'CzBhFBWqHqGkZVvDFH'
    }
  })

const getTransportFromEnvironment = () =>
  nodemailer.createTransport({
    host: process.env.VLY_SMTP_HOST,
    port: process.env.VLY_SMTP_PORT,
    secure: false
  })

let currentTransport = null

if (process.env.NODE_ENV === 'test') {
  currentTransport = getTransportMock
} else if (process.env.VLY_SMTP_HOST && process.env.VLY_SMTP_PORT) {
  currentTransport = getTransportFromEnvironment
} else if (process.env.NODE_ENV === 'development') {
  currentTransport = getTransportDev
} else {
  currentTransport = getTransportSES
}

module.exports = {
  getTransportSES,
  getTransportDev, // should use this one for development only
  getTransportMock, // use for testing
  getTransport: currentTransport
}
