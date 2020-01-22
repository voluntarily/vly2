const { getTransport } = require('../../services/email/email')
const Email = require('email-templates')
const { config } = require('../../../config/config')
const { getUnsubscribeLink } = require('./person.lib')
/*
  format and send a email to the given address
  @to {person Object} the target of the email
  @template the template to format html
  @props includes details of the opportunity, requestor etc
*/
module.exports.emailPerson = async (template, to, props, renderOnly = false) => {
  try {
    const transport = getTransport()
    const email = new Email({
      message: {
        from: 'no-reply@voluntarily.nz'
      },
      // uncomment below to send emails in development/test env:
      send: true,
      subjectPrefix: config.env === 'production' ? false : `[${config.env.toUpperCase()}] `,

      // Comment the line below to see preview email
      preview: false,
      textOnly: config.onlyEmailText, // The value onlyEmailText has a Boolean type not string
      transport
    })

    props.appUrl = config.appUrl

    if (to._id) {
      props.unsubscribeLink = getUnsubscribeLink(to)
    }

    if (renderOnly) {
      return await email.render(
        template + '/html',
        {
          to,
          ...props
        }
      )
    } else {
      return await email.send({
        template: template,
        message: {
          to: to.email,
          attachments: props.attachment ? props.attachment : null
        },
        locals: {
          to,
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
