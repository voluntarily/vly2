const nodemailer = require('nodemailer')

const getTransportTest = () => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  return nodemailer.createTestAccount()
    .then(testAccount => {
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass // generated ethereal password
        }
      })
    })
}

// Use AWS SMTP service
// for ses-smtp-user.20190425-160307
// from must be andrew@voluntari.ly
// to must be registered emails until we get out of the sandbox
const getTransportSES = () =>
  nodemailer.createTransport({
    host: 'email-smtp.us-west-2.amazonaws.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'AKIAYQPYA7TMBMIRDKX2',
      pass: 'BFNKuwq/8ud/fq+kEUWV0yJDg6cexZ0gYwaNctH7Yfp3'
    }
  })

module.exports = {
  getTransportSES,
  getTransportTest,
  getTransport: (process.env.NODE_ENV === 'test') ? getTransportTest : getTransportSES
  // getTransport: getTransportSES
}
