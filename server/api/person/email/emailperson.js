const { getTransport } = require('../../../services/email/email')
const Email = require('email-templates')
const path = require('path')

/*
  format and send a email to the given address
*/
module.exports.emailPerson = async (person, template, props) => {
  try {
    const transport = await getTransport()
    const email = new Email({
      message: {
        from: 'andrew@voluntari.ly'
      },
      // uncomment below to send emails in development/test env:
      send: props.send,

      // preview: {
      //   app: 'firefox',
      //   wait: false
      // },
      // transport: {
      //   jsonTransport: true,
      // }
      transport
    })
    console.log('email props', props)
    return await email.send({
      template: path.join(__dirname, template),
      message: {
        to: person.email
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
