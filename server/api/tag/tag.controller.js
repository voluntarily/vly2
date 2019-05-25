/**
 * Get a given tag
 */

// take the request body, and search for the tag in the tag schema, based on the value (case-insensitive)
const getTag = (req, res) => {
  const result = {
    message: greet,
    health: 'OK',
    params: req.params,
    query: req.query
  }
  return res.status(200).json(result)
}

module.exports = getHealth
