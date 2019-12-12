const Member = require('./member')

const findOrgByPersonIdAndCategory = async (personId, category) => {
  // search membership table for org matching category and person id
  const query = { person: personId }
  let myorgs = await Member.find(query).populate({ path: 'organisation', select: 'name category' }).exec()

  // filter by category if present  e.g /my/org/vp
  if (category) {
    myorgs = myorgs.filter(
      o => o.organisation.category.includes(category))
  }
  if (!myorgs.length) { // failed to find matching org
    return null
  }
  // get id of Organisation
  return myorgs[0].organisation._id
}

module.exports = {
  findOrgByPersonIdAndCategory
}
