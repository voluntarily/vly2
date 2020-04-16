const { getTransport } = require('../../services/email/email')
const Email = require('email-templates')
const { config } = require('../../../config/serverConfig')
const { getUnsubscribeLink } = require('./person.lib')
/*
  format and send a email to the given address
  @to {person Object} the target of the email
  @template the template to format html
  @props includes details of the opportunity, requestor etc
*/
module.exports.emailPerson = async (template, to, props, renderOnly = false) => {
  // console.log('emailPerson', template, to.email, props)
  if (to._id && !to.sendEmailNotifications) {
    return null
  }
  const transport = getTransport()
  const email = new Email({
    message: {
      from: 'no-reply@vocationally.marscloud.co.nz'
    },
    // uncomment below to send emails in development/test env:
    send: true,
    subjectPrefix: config.env === 'production' ? false : `[${config.env.toUpperCase()}] `,

    // uncomment the line below to see preview email
    // preview: true,
    textOnly: config.onlyEmailText, // The value onlyEmailText has a Boolean type not string
    transport
  })

  props.appUrl = config.appUrl
  props.template = template

  if (to._id) {
    props.unsubscribeLink = getUnsubscribeLink(to)
  }

  if (renderOnly) {
    return email.render(
      template + '/html',
      {
        to,
        ...props
      }
    )
  } else {
    return email.send({
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
}
