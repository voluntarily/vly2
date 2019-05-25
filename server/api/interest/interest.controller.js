const Interest = require('./interest')
const Person = require('../person/person')
const Opportunity = require('../opportunity/opportunity')
const sanitizeHtml = require('sanitize-html')
// const { emailPerson } = require('./email/emailperson')

/**
  api/interests -> list all interests
  api/interests?op='opid' -> lists all interests associated with opid.
  api/interests?op='opid'&me='personid' -> lists all interests (hopefully only 0 or 1) associated with opid and personid.
 */
const listInterests = async (req, res) => {
  // console.log(req.query)
  let sort = 'dateAdded' // todo sort by date.
  let interestsArray
  try {
    if (req.query.op) {
      const query = { opportunity: req.query.op }
      if (req.query.me) {
        query.person = req.query.me
      }
      interestsArray = await Interest.find(query).sort(sort).exec()
    } else {
      interestsArray = await Interest.find().sort(sort).exec()
    }
  
     
    for (let i = 0; i < interestsArray.length; i++) {

      // Get individual person from database based on person id in interest
      let person = await Person.findOne({ _id: interestsArray[i].person }).exec()
      //console.log(`Name: ${person.name}, Email: ${person.email}`)
      interestsArray[i].name = person.name
      //Probably will want ot be careful about passing email information to clientside
      interestsArray[i].email = person.email
    }

    res.json(interestsArray)
  } catch (err) {
    console.log(err)
    res.status(404).send(err)
  }
}

const createInterest = async (req, res) => {

  const newInterest = new Interest(req.body)
  newInterest.comment = sanitizeHtml(newInterest.comment)
  newInterest.save((err, saved) => {
    if (err) {
      res.status(500).send(err)
    }

    res.json(saved)
  })

}

const updateInterest = async (req, res) => {

  let got
  try {
    got = await Interest.update({ _id: req.body._id }, { $set: { status: req.body.status } }).exec()
    console.log(got)
    

    res.json(req.body)

  } catch (err) {
    console.log(err)
    res.status(404).send(err)
  }
}

async function maybeInnovativelyDestructivelySendEmailPossibly(volunteerId, organizerId, prevStatus, currentStatus, modifier) {

  if (modifier == 'volunteer') {

    if (currentStatus == 'interested') { // A volunteer just clicked "interested"
      console.log('A volunteer just clicked "interested"')

    } else if (currentStatus == 'committed') { // A volunteer accepts an invitation
      console.log('A volunteer accepts an invitation')
    }

  } else {

    if (currentStatus == 'interested') { // An organizer just withdrew an invite
      console.log('An organizer just withdrew an invite')

    } else if (currentStatus == 'invited') { // An organizer just sent an invite
      console.log('An organizer just sent an invite')

    } else if (currentStatus == 'declined') { // An organizer just declined someone
      console.log('An organizer just declined someone')
    }

  }

}

module.exports = {
  listInterests,
  createInterest,
  updateInterest
}
