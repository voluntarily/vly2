/**
 * Get system health and ask questions
 */

// TODO get the version number or build number here
const greet = 'Hello from Voluntari.ly V0.0.2'

// check a bunch of things here like whether the db is connected and responding.
// any depended upon api services
const getHealth = (req, res) => {
  const result = {
    message: greet,
    health: 'OK',
    params: req.params,
    query: req.query
  }
  // console.log('api/health requested', result)
  return res.status(200).json(result)
}

module.exports = getHealth
