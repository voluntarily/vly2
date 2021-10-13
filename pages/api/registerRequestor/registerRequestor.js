import fetch from 'isomorphic-fetch'
import { Role } from '../../../server/services/authorize/role'
import { JSDOM } from 'jsdom'
import moment from 'moment'

/* the registerRequestor endpoint allows a person to
   register as an opportunity provider or activity provider

   /api/registerRequestor?trn=[teacherRegistration]

   trn: teacherRegistrationNumber 6 digit number
    if no query provided then a current status is returned for the signed in user

   makes a remote api call to get the record associated with the teacher registration
   compares the results with the person signed in record me.
   if ok sets OP status and returns message.
   else errors:
    - registration id not found  - 404 - Not found
    - found but didn't match name - 400 Bad Request
*/
function intersect (a, b) {
  let t
  if (b.length > a.length) {
    t = b
    b = a
    a = t
  } // indexOf to loop over shorter
  return a.filter(function (e) {
    return b.indexOf(e) > -1
  })
}

export default async (req, res) => {
  // res.setHeader('Content-Type', 'application/json')
  if (!req.session.isAuthenticated) res.status(403).end()
  // check parameters
  const { trn } = req.query
  const me = req.session && req.session.me
  if (!trn) {
    return res.json(me)
  }

  const teachingCouncilURL = `https://teachingcouncil.nz/ajax/regsearch/${trn}/none`
  try {
    const regResponse = await fetch(teachingCouncilURL, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const regsearch = await regResponse.json()
    if (regsearch[0] === 'error') {
      return res.status(404).json(regsearch[1])
    } // no match
    const frag = JSDOM.fragment(regsearch[1])
    const reg = {
      trn,
      firstname: frag.querySelectorAll('.surname')[0].textContent,
      lastname: frag.querySelectorAll('.surname')[1].textContent,
      category: frag.querySelector('.register-category').textContent,
      expiry: frag.querySelector('.register-expiry').textContent
    }
    // is this the person you are looking for?
    const matchNames = intersect([...reg.firstname.split(' '), ...reg.lastname.split(' ')], me.name.split(' '))

    if (matchNames.length < 2) { // names do not match enough
      return res.status(404).end(`Names do not match: ${reg.firstname}, ${reg.lastname}`)
    }
    if (!['Full', 'Provisional', 'Subject to Confirmation'].includes(reg.category)) {
      return res.status(404).end(`Invalid Category: ${reg.category}`)
    }
    if (!reg.expiry || moment(reg.expiry).isBefore(moment())) {
      return res.status(404).json(['error', `Registration Expired: ${reg.expiry}`])
    }
    // We have a teacher
    me.teacher = { registration: reg }
    me.role.indexOf(Role.OPPORTUNITY_PROVIDER) === -1 && me.role.push(Role.OPPORTUNITY_PROVIDER)
    await me.save()
    res.json(me)
  } catch (e) {
    console.error('registerRequestor:', e)
    res.status(500).end()
  }
}
