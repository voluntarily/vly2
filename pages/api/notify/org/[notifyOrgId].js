import Organisation from '../../../../server/api/organisation/organisation'
import Member from '../../../../server/api/member/member'
import { MemberStatus } from '../../../../server/api/member/member.constants'
import { emailPerson } from '../../../../server/api/person/person.email'
import { makeURLToken } from '../../../../lib/sec/actiontoken'
import { config } from '../../../../config/clientConfig'
import Role from '../../../../server/services/authorize/role'
export default async (req, res) => {
  // verify signed in
  if (!req.session || !req.session.isAuthenticated) { return res.status(403).end() }

  try {
    // verify the org
    const orgid = req.query.notifyOrgId
    const org = await Organisation.findById(orgid, 'name imgUrl').lean().exec()

    // verify I am orgAdmin of org
    const me = req.session.me // signed in person
    const membershipQuery = {
      person: me._id,
      organisation: orgid
    }
    const membership = await Member.findOne(membershipQuery).exec()
    if (!(membership && membership.status === MemberStatus.ORGADMIN) || me.role.includes(Role.ADMIN)) {
      console.error('you are not an orgadmin of this organisation')
      return res.status(403).json({ error: 'signed-in person is not an orgadmin of the requested organisation' })
    }
    // make org links canonical
    org.imgUrl = new URL(org.imgUrl, config.appUrl).href
    org.href = `${config.appUrl}/orgs/${orgid}`
    const payload = {
      landingUrl: '/api/notify/org/action',
      redirectUrl: `/orgs/${orgid}`,
      data: {
        orgid,
        memberStatus: req.query.memberStatus,
        memberValidation: req.query.memberValidation
      },
      action: 'join',
      expiresIn: '2d'
    }
    payload.token = makeURLToken(payload)
    const adminMsg = req.query.adminMsg || ''
    const memberStatus = req.query.memberStatus || MemberStatus.FOLLOWER
    const buttonLabel = req.query.buttonLabel || 'Confirm Membership'
    // template expects
    //    to: person receiving email
    // -   from: person sending email - the orgAdmin
    // -   org: The organisation (with added href linkback)
    // -   adminMsg: text added by the orgAdmin
    // -   memberStatus: follower, joiner, member etc.
    // -   buttonLabel: label for callback button
    // -   buttonHref: the callback button url

    const info = await emailPerson('inviteMember', me, {
      from: me,
      org,
      adminMsg,
      memberStatus,
      buttonLabel,
      buttonHref: payload.token
    })
    const response = {
      id: req.query.notifyOrgId,
      payload,
      session: req.session,
      org,
      info
    }
    return res.json(response)
  } catch (e) {
    console.error('notifyOrg', e)
    res.status(404).end()
  }
}
