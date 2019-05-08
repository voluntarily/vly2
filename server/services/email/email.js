const nodemailer = require('nodemailer')

const getTransportTest = async () => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  const testAccount = await nodemailer.createTestAccount()
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass // generated ethereal password
    }
  })
  return transporter
}
module.exports.getTransportTest = getTransportTest

// Use AWS SMTP service
// for ses-smtp-user.20190425-160307
// from must be andrew@voluntari.ly
// to must be registered emails until we get out of the sandbox
const getTransportSES = async () => {
  const transporter = nodemailer.createTransport({
    host: 'email-smtp.us-west-2.amazonaws.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'AKIAYQPYA7TMBMIRDKX2',
      pass: 'BFNKuwq/8ud/fq+kEUWV0yJDg6cexZ0gYwaNctH7Yfp3'
    }
  })
  return transporter
}

// TODO set the transport returned based on the environment e.g. TEST.
// export const getTransport = getTransportTest;

module.exports.getTransport = getTransportSES
