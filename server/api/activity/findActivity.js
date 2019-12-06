const Activity = require('./activity')

const findActivity = async (req, res) => {
  // filter by category if present  e.g /my/org/vp
  const slug = req.params.slug
  // get id of Activity
  try {
    const act = await Activity.findOne({ slug }, 'name').exec()
    res.redirect(307, `/acts/${act._id}`)
  } catch (e) {
    return res.status(404).send('No matching activity')
  }
}

module.exports = {
  findActivity
}
