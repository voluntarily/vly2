const { makeURLToken } = require('../../../lib/sec/actiontoken')
const { Role } = require('../../services/authorize/role')
const SchoolLookUp = require('../school-lookup/school-lookup')
const { getTransport } = require('../../services/email/email')
const Email = require('email-templates')
const { config } = require('../../../config/config')

class SchoolInvite {
  static async send (req, res) {
    res.setHeader('Content-Type', 'application/json')

    if (!SchoolInvite.isPostRequest(req)) {
      return res.status(404).end()
    }

    if (!SchoolInvite.userCanSendInvite(req)) {
      return res.status(403).end()
    }

    if (!req.body) {
      return res.status(400).end()
    }

    const postData = req.body

    const missingFields = SchoolInvite.getMissingRequiredFields(postData)

    if (missingFields.length > 0) {
      return res.status(400).send({
        message: `Missing required fields (${missingFields.join(', ')})`
      })
    }

    const school = await SchoolLookUp.findOne({ schoolId: postData.schoolId })

    if (!school) {
      return res.status(400).send({
        message: 'School not found'
      })
    }

    const payload = {
      landingUrl: '/not-yet-implemented',
      redirectUrl: '/not-yet-implemented',
      data: {},
      action: 'join',
      expiresIn: '2d'
    }

    const tokenUrl = makeURLToken(payload)

    const emailSuccess = await SchoolInvite.sendInviteEmail({
      inviteeName: postData.inviteeName,
      inviteeEmail: postData.inviteeEmail,
      invitationMessage: postData.invitationMessage || '',
      schoolName: school.name,
      tokenUrl: tokenUrl
    })

    if (emailSuccess) {
      return res.send({
        message: 'Invitation email sent successfully'
      })
    } else {
      return res.status(500).send({
        message: 'Invitation email failed to send'
      })
    }
  }

  static isPostRequest (req) {
    return (req.method === 'POST')
  }

  static userCanSendInvite (req) {
    return (
      req.session &&
      req.session.isAuthenticated &&
      req.session.me.role.includes(Role.ADMIN)
    )
  }

  static getMissingRequiredFields (postData) {
    const missingFields = []

    for (const requiredField of ['schoolId', 'inviteeName', 'inviteeEmail']) {
      if (!postData[requiredField]) {
        missingFields.push(requiredField)
      }
    }

    return missingFields
  }

  static async sendInviteEmail (emailData) {
    const emailTransport = await getTransport()

    const inviteEmail = new Email({
      message: {
        from: 'no-reply@voluntarily.nz'
      },
      send: true,
      subjectPrefix: config.env === 'production' ? '' : `[${config.env.toUpperCase()}] `,
      textOnly: config.onlyEmailText,
      transport: emailTransport
    })

    try {
      const sentEmailInfo = await inviteEmail.send({
        template: 'inviteSchool',
        message: {
          to: emailData.inviteeEmail
        },
        locals: {
          inviteeName: emailData.inviteeName,
          schoolName: emailData.schoolName,
          adminMsg: emailData.invitationMessage,
          inviteButtonLink: emailData.tokenUrl
        }
      })

      return (sentEmailInfo.accepted.length > 0)
    } catch (error) {
      return false
    }
  }
}

module.exports = {
  SchoolInvite
}
