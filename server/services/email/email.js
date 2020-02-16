const nodemailer = require('nodemailer')
const { config } = require('../../../config/config')

const currentTransport = () => {
  if (process.env.mockEmails || config.env === 'test') {
    const nodemailerMock = require('nodemailer-mock')

    return (nodemailerMock.createTransport({
      host: 'smtp.voluntarily.nz',
      port: 587,
      secure: false
    }))
  } else if (process.env.VLY_SMTP_HOST && process.env.VLY_SMTP_PORT) {
    return nodemailer.createTransport({
      host: process.env.VLY_SMTP_HOST,
      port: process.env.VLY_SMTP_PORT,
      secure: false
    })
  } else if (config.env === 'development') {
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'emma.lockman76@ethereal.email', // If the email is not sent, just need to get on the website and create a new account
        pass: 'CzBhFBWqHqGkZVvDFH'
      }
    })
  } else {
    return nodemailer.createTransport({
      host: 'email-smtp.us-west-2.amazonaws.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.SMTP_ID,
        pass: config.SMTP_PWD
      }
    })
  }
}

module.exports = {
  getTransport: currentTransport
}
