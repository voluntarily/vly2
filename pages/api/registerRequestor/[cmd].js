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

export const command = async (req, res) => {
  if (!req.session.isAuthenticated) res.status(403).end()
  // check parameters
  try {
    const { cmd } = req.query
    const me = req.session && req.session.me
    if (cmd === 'reset') {
      delete me.teacher.registration
      // await me.save()
      return res.json(me)
    } else {
      res.status(400).end()
    }
  } catch (e) {
    console.error('registerRequestor:', e)
    res.status(500).end()
  }
}
export default command
