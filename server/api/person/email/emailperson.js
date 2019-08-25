const { getTransport, getDevelopmentTransport } = require('../../../services/email/email')
const Email = require('email-templates')
const path = require('path')
const { config } = require('../../../../config/config')

/*
  format and send a email to the given address
*/
module.exports.emailPerson = async (person, template, props) => {
  try {
    const transport = (process.env.NODE_ENV === 'development') ? await getDevelopmentTransport() : await getTransport()
    const email = new Email({
      message: {
        from: 'andrew@voluntarily.nz'
      },
      // uncomment below to send emails in development/test env:
      send: true,

      // Comment the line bellow to see preview email
      preview: false,
      // Uncomment this line to see the result of the email when it sent
      // preview: {
      //   app: 'chrome',
      //   wait: false
      // },

      // Not sure if the transport is neccesary anymore
      // transport: {
      //   jsonTransport: true,
      // }
      textOnly: config.onlyEmailText, // The value onlyEmailText has a Boolean type not string
      transport
    })
    // console.log('email props ', props)
    return await email.send({
      template: path.join(__dirname, template),
      message: {
        to: person.email,
        attachments: props.attachment ? props.attachment : null
      },
      locals: {
        person,
        props
      }
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
  return null
}
