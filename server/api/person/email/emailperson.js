const { getTransport, getDevelopmentTransport } = require('../../../services/email/email')
const Email = require('email-templates')
const path = require('path')
const { config } = require('../../../../config/config')
/*
  format and send a email to the given address
  @person the target of the email
  @template the template to format html
  @props includes details of the opportunity, requestor etc
*/
module.exports.emailPerson = async (person, template, props, renderOnly = false) => {
  try {
    const transport = (process.env.NODE_ENV === 'development') ? await getDevelopmentTransport() : await getTransport()
    const email = new Email({
      message: {
        from: 'andrew@voluntarily.nz'
      },
      // uncomment below to send emails in development/test env:
      send: true,
      subjectPrefix: config.env === 'production' ? false : `[${config.env.toUpperCase()}] `,

      // Comment the line below to see preview email
      preview: true,
      textOnly: config.onlyEmailText, // The value onlyEmailText has a Boolean type not string
      transport
    })
    if (renderOnly) {
      return await email.render(
        path.join(__dirname, template + '/html'),
        {
          person,
          ...props
        }
      )
    } else {
      return await email.send({
        template: path.join(__dirname, template),
        message: {
          to: person.email,
          attachments: props.attachment ? props.attachment : null
        },
        locals: {
          person,
          ...props
        }
      })
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
  return null
}
