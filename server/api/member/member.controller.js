const Member = require('./member')
// const Person = require('../person/person')
const Organisation = require('../organisation/organisation')
// const { config } = require('../../../config/config')
// const { emailPerson } = require('../person/email/emailperson')
// const { MemberStatus } = require('./member.constants')

/**
  api/members -> list all members
  api/members?org='orgid' -> lists all members associated with orgid.
  api/members?org='orgid'&me='personid' -> lists all members (hopefully only 0 or 1) associated with opid and personid.
  api/members?me='personid' -> list all the orgs i'm membered in and populate the org out.
 */
const listMembers = async (req, res) => {
  let sort = 'status'
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
      got = await Member.find(query).populate({ path: 'person', select: 'nickname name avatar' }).sort(sort).exec()
    } else if (req.query.meid) {
      // a person is asking for the orgs they follow or are members of
      const query = { person: req.query.meid }
      // return info for an orgCard
      got = await Member.find(query).populate({ path: 'organisation', select: 'name imgUrl' }).sort(sort).exec()
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
    console.log('updateMember', req.body)
    await Member.updateOne({ _id: req.body._id }, { $set: { status: req.body.status, validation: req.body.validation } }).exec()
    const { organisation } = req.body // person in here is the volunteer-- quite not good naming here
    Organisation.findById(organisation, (err, organisationFound) => {
      if (err) console.log(err, organisationFound)
      else {
        // TODO: [VP-436] notify the person of their status change in the organisation
        // const { organisation, status, person } = req.body // person in here is the volunteer-- quite not good naming here
        // notify the person of their status change in the organisation
        // processStatusToSendEmail(status, organisationFound, person)
      }
    })
    res.json(req.body)
  } catch (err) {
    res.status(404).send(err)
  }
}

const createMember = async (req, res) => {
  const newMember = new Member(req.body)
  newMember.save(async (err, saved) => {
    if (err) {
      return res.status(500).send(err)
    }

    // TODO: [VP-424] email new members or followers of an organisation
    // const volunteerID = req.body.person
    // const { organisation } = req.body
    // const { title } = organisation
    // const { requestor } = req.body.organisation
    // const orgId = organisation._id
    // const { validation } = req.body
    // requestor.volunteerComment = validation
    // // sendEmailBaseOn('acknowledgeMember', volunteerID, title, opId)
    // // sendEmailBaseOn('RequestorNotificationEmail', requestor._id, title, opId, comment)

    // return the member record with the org name filled in.
    const got = await Member.findOne({ _id: saved._id }).populate({ path: 'organisation', select: 'name' }).exec()
    res.json(got)
  })
}

// const processStatusToSendEmail = (memberStatus, organisation, volunteer) => {
//   const { _id } = volunteer
//   const { requestor, title } = organisation
//   const opID = organisation._id
//   if (memberStatus === MemberStatus.INVITED || memberStatus === MemberStatus.DECLINED) {
//     // send email to volunteer only
//     sendEmailBaseOn(memberStatus, _id, title, opID) // The _id in here is the volunteer id
//   } else if (memberStatus === MemberStatus.COMMITTED) {
//     // send email to requestor only
//     sendEmailBaseOn(memberStatus, requestor, title, opID)
//   }
// }

/**
 * This will be easier to add more status without having too much if. All we need is add another folder in email template folder and the status will reference to that folder
 * @param {string} status status will be used to indicate which email template to use
 * @param {string} personID so we can find the email of that person
 * @param {string} organisationTitle Just making the email content clearer
 * @param {string} opId To construct url that link to the organisation
 * @param {string} volunteerCommment (optional) This is only for requestor notification email only,default is empty string
 */
// const sendEmailBaseOn = async (status, personID, organisationTitle, opId, volunteerComment = '') => {
//   let opUrl = `${config.appUrl + '/ops/' + opId}`
//   await Person.findById(personID, (err, person) => {
//     if (err) console.log(err)
//     else {
//       const emailProps = {
//         send: true
//       }
//       person.opUrl = opUrl
//       person.volunteerEvent = organisationTitle
//       person.volunteerComment = volunteerComment
//       emailPerson(person, status, emailProps)
//     }
//   })
// }

module.exports = {
  listMembers,
  updateMember,
  createMember
}
