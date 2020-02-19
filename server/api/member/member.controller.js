const Member = require('./member')
const { getMemberbyId } = require('./member.lib')
const { Action } = require('../../services/abilities/ability.constants')

/**
  api/members -> list all members
  api/members?org='orgid' -> lists all members associated with orgid.
  api/members?org='orgid'&me='personid' -> lists all members (hopefully only 0 or 1) associated with opid and personid.
  api/members?me='personid' -> list all the orgs i'm membered in and populate the org out.
 */
const listMembers = async (req, res) => {
  const sort = 'status'

  try {
    const find = {}
    const populateList = []

    if (req.query.orgid) {
      find.organisation = req.query.orgid
      populateList.push({ path: 'person', select: 'nickname name imgUrl email phone sendEmailNotifications' })
    }

    if (req.query.meid) {
      find.person = req.query.meid
      populateList.push({ path: 'organisation', select: 'name imgUrl category' })
    }

    const query = Member.find(find)

    for (const populate of populateList) {
      query.populate(populate)
    }

    const members = await query
      .accessibleBy(req.ability, Action.LIST)
      .sort(sort)
      .exec()

    res.json(members)
  } catch (err) {
    res.status(404).send(err)
  }
}

const getMember = async (req, res) => {
  try {
    const member = await Member
      .accessibleBy(req.ability, Action.READ)
      .findOne(req.params)

    if (member === null) {
      return res.status(404).send()
    }

    res.json(member)
  } catch (e) {
    res.status(500).send()
  }
}

const updateMember = async (req, res) => {
  try {
    const member = await Member
      .accessibleBy(req.ability, Action.READ)
      .findOne(req.params)

    if (!member) {
      return res.sendStatus(404)
    }

    const updatedMember = Object.assign(member, req.body)

    if (!req.ability.can(Action.UPDATE, updatedMember)) {
      return res.sendStatus(404)
    }

    await updatedMember.save()

    res.json(updatedMember)
  } catch (err) {
    res.status(500).send(err)
  }
}

const createMember = async (req, res) => {
  const memberData = req.body

  if (!memberData.person) {
    memberData.person = (req.session.me && req.session.me._id) ? req.session.me._id : undefined
  }

  const member = new Member(req.body)

  if (!req.ability.can(Action.CREATE, member)) {
    return res.sendStatus(403)
  }

  try {
    await member.save()

    const createdMember = await getMemberbyId(member._id)
    res.json(createdMember)
  } catch (error) {
    return res.sendStatus(500)
  }
}

/**
 * This will be easier to add more status without having too much if. All we need is add another folder in email template folder and the status will reference to that folder
 * @param {string} template status will be used to indicate which email template to use
 * @param {object} to person email is for. (requestor or volunteer) with email populated.
 * @param {object} member populated out member with person and op. can be null
 * @param {object} org the current organisation
 * @param {object} props extra properties such as attachment
 */
// const sendMemberEmail = async (template, to, from, interest, org, props) => {
//   const op = interest.opportunity
//   await emailPerson(template, to, {
//     send: true,
//     op,
//     from,
//     org,
//     ...props
//   })
// }

// const sendMemberInvitation = async () => {
//   // template expects
//   //    to: person receiving email
//   // -   from: person sending email - the orgAdmin
//   // -   org: The organisation (with added href linkback)
//   // -   adminMsg: text added by the orgAdmin
//   // -   buttonLabel: label for callback button
//   // -   buttonHref: the callback button url

//   const me = req.session.me
//   sendMemberEmail('inviteMember', me)
// }
module.exports = {
  listMembers,
  getMember,
  updateMember,
  createMember
}
