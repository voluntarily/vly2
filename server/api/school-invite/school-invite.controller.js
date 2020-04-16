const { handleToken } = require('../../../pages/api/token/token')
const { makeURLToken } = require('../../../lib/sec/actiontoken')
const { Role } = require('../../services/authorize/role')
const SchoolLookUp = require('../school-lookup/school-lookup')
const { getTransport } = require('../../services/email/email')
const Email = require('email-templates')
const { config } = require('../../../config/serverConfig')
const Organisation = require('../organisation/organisation')
const slug = require('limax')
const { MemberStatus } = require('../member/member.constants')
const { addMember } = require('../member/member.lib')
const { OrganisationRole } = require('../organisation/organisation.constants')

class SchoolInvite {
  static async send(req, res) {
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
      landingUrl: '/api/notify/school-invite/accept',
      redirectUrl: '/home',
      data: {
        schoolId: school.schoolId
      },
      action: 'join',
      expiresIn: '2w' // invite is valid for 2 weeks
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

  static isPostRequest(req) {
    return (req.method === 'POST')
  }

  static userCanSendInvite(req) {
    return (
      req.session &&
      req.session.isAuthenticated &&
      req.session.me.role.includes(Role.ADMIN)
    )
  }

  static getMissingRequiredFields(postData) {
    const missingFields = []

    for (const requiredField of ['schoolId', 'inviteeName', 'inviteeEmail']) {
      if (!postData[requiredField]) {
        missingFields.push(requiredField)
      }
    }

    return missingFields
  }

  static async sendInviteEmail(emailData) {
    const emailTransport = await getTransport()

    const inviteEmail = new Email({
      message: {
        from: 'no-reply@vocationally.marscloud.co.nz'
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
          inviteButtonLink: emailData.tokenUrl,
          appUrl: config.appUrl
        }
      })

      return (sentEmailInfo.accepted.length > 0)
    } catch (error) {
      return false
    }
  }

  static async accept(request, response) {
    return handleToken(request, response, {
      join: async (props) => {
        try {
          const organisation = await SchoolInvite.createOrganisationFromSchool(props.schoolId)
          await SchoolInvite.linkPersonToOrganisationAsAdmin(organisation._id, request.session.me._id.toString())
        } catch (error) {
          // in the event something goes wrong during this process
          // we don't want to stop the person's journey here because
          // they will end up on a blank/500 error screen so for now
          // we'll log this error and let the person continue on to
          // the redirect URL (which should be /home in this case)
          console.error('School-invite-controller', error)
        }
      }
    })
  }

  static async createOrganisationFromSchool(schoolId) {
    const schoolData = await SchoolLookUp.findOne({ schoolId: schoolId })

    if (!schoolData) {
      throw new Error('School not found')
    }

    const schoolToOrgMap = {
      name: 'name',
      contactName: 'contactName',
      contactEmail: 'contactEmail',
      telephone: 'contactPhoneNumber',
      website: 'website',
      address: 'address',
      decile: 'decile'
    }

    const initialOrganisationData = {}

    for (const schoolFieldName of Object.keys(schoolToOrgMap)) {
      const organisationFieldName = schoolToOrgMap[schoolFieldName]

      initialOrganisationData[organisationFieldName] = schoolData[schoolFieldName]
    }

    initialOrganisationData.role = [OrganisationRole.OPPORTUNITY_PROVIDER]
    initialOrganisationData.slug = slug(initialOrganisationData.name)
    // check whether org already exists. - match slug.
    const existingOrg = await Organisation.findOne({ slug: initialOrganisationData.slug })
    if (existingOrg) return existingOrg
    return Organisation.create(initialOrganisationData)
  }

  static async linkPersonToOrganisationAsAdmin(organisationId, personId) {
    return addMember({
      person: personId,
      organisation: organisationId,
      validation: 'orgAdmin from school-invite controller',
      status: MemberStatus.ORGADMIN
    })
  }
}

module.exports = {
  SchoolInvite
}
