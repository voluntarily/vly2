const Member = require('./member')
// const Person = require('../person/person')
const Organisation = require('../organisation/organisation')
// const { config } = require('../../../config/config')
// const { MemberStatus } = require('./member.constants')
// const { emailPerson } = require('../person/person.email')

/* get a single member record with org and person populated out */
const getMemberbyId = id => {
  return Member.findOne({ _id: id })
    .populate({ path: 'person', select: 'nickname name imgUrl email' })
    .populate({ path: 'organisation', select: 'name imgUrl category' })
    .exec()
}

/**
  api/members -> list all members
  api/members?org='orgid' -> lists all members associated with orgid.
  api/members?org='orgid'&me='personid' -> lists all members (hopefully only 0 or 1) associated with opid and personid.
  api/members?me='personid' -> list all the orgs i'm membered in and populate the org out.
 */
const listMembers = async (req, res) => {
  const sort = 'status'
  let got
  try {
    if (req.query.orgid) {
      // an org is asking for a list of members/followers
      const query = { organisation: req.query.orgid }
      if (req.query.meid) {
        // a person is asking for their relationship with an org
        query.person = req.query.meid
      }
      // Return enough info for a personCard
      got = await Member.find(query).populate({ path: 'person', select: 'nickname name imgUrl email phone' }).sort(sort).exec()
    } else if (req.query.meid) {
      // a person is asking for the orgs they follow or are members of
      const query = { person: req.query.meid }
      // return info for an orgCard
      got = await Member.find(query).populate({ path: 'organisation', select: 'name imgUrl category' }).sort(sort).exec()
    } else {
      // list all relationships
      got = await Member.find().sort(sort).exec()
    }
    res.json(got)
  } catch (err) {
    res.status(404).send(err)
  }
}

const updateMember = async (req, res) => {
  try {
    await Member.updateOne({ _id: req.body._id }, { $set: { status: req.body.status, validation: req.body.validation } }).exec()
    const { organisation } = req.body // person in here is the volunteer-- quite not good naming here
    Organisation.findById(organisation, (err, organisationFound) => {
      if (err) console.error(err, organisationFound)
      else {
        // TODO: [VP-436] notify the person of their status change in the organisation
        // const { organisation, status, person } = req.body // person in here is the volunteer-- quite not good naming here
        // notify the person of their status change in the organisation
        // processStatusToSendEmail(status, organisationFound, person)
      }
    })
    const got = await getMemberbyId(req.body._id)

    res.json(got)
  } catch (err) {
    res.status(404).send(err)
  }
}

// creates a new member or updates status of existing member
const addMember = async (member) => {
  const found = await Member.findOneAndUpdate(
    { // check for a match
      person: member.person,
      organisation: member.organisation
    },
    member, // create or upsert
    { new: true, upsert: true }
  )
  // get populated out member record
  const got = await getMemberbyId(found._id)
  return got
}

const createMember = async (req, res) => {
  const newMember = new Member(req.body)
  newMember.save(async (err, saved) => {
    if (err) {
      return res.status(500).send(err)
    }

    // TODO: [VP-424] email new members or followers of an organisation
    // return the member record with the org name filled in.
    const got = await getMemberbyId(newMember._id)
    res.json(got)
  })
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
  updateMember,
  createMember,
  addMember
}
