const Activity = require('./activity')
const Organisation = require('../organisation/organisation')
const escapeRegex = require('../../util/regexUtil')
const { Action } = require('../../services/abilities/ability.constants')
const { Role } = require('../../services/authorize/role')
const sanitizeHtml = require('sanitize-html')
const { ActivityListFields } = require('./activity.constants')
const { isValidFileUrl } = require('../file/file.controller')
const { getOpsForActivity } = require('./activity.lib')
/**
 * Get all orgs
 * @param req
 * @param res
 * @returns void
 */
const listActivities = async (req, res) => {
  let query = {} // { status: 'active' }
  let sort = 'name'
  let select = ActivityListFields.join(' ')
  const noCounts = req.query.nocounts
  try {
    query = req.query.q ? JSON.parse(req.query.q) : query
    sort = req.query.s ? JSON.parse(req.query.s) : sort
    select = req.query.p ? JSON.parse(req.query.p) : select
  } catch (e) {
    return res.status(400).send(e)
  }

  try {
    if (req.query.search) {
      const search = req.query.search.trim()
      const regexSearch = escapeRegex(search)
      const searchExpression = new RegExp(regexSearch, 'i')
      // find any organization matching search
      const matchingOrgIds = await Organisation.find({ name: searchExpression }, '_id').lean()

      // split around one or more whitespace characters
      const keywordArray = search.split(/\s+/)

      const searchParams = {
        $or: [
          { name: searchExpression },
          { subtitle: searchExpression },
          { description: searchExpression },
          { tags: { $in: keywordArray } }
        ]
      }
      // mongoose isn't happy if we provide an empty array as an expression
      if (matchingOrgIds.length > 0) {
        const orgIdExpression = {
          $or: matchingOrgIds.map(id => ({ offerOrg: id }))
        }
        searchParams.$or.push(orgIdExpression)
      }
      query = {
        $and: [
          searchParams,
          query
        ]
      }
    }

    try {
      let acts = await Activity
        .accessibleBy(req.ability, Action.LIST)
        .find(query)
        .select(select)
        .populate('offerOrg', 'name')
        .sort(sort)
        .lean()

      if (!noCounts) {
        acts = await Promise.all(acts.map(async (act) => {
          const opCounts = await getOpsForActivity(act._id)
          return { ...act, opCounts }
        }))
      }
      res.json(acts)
    } catch (e) {
      res.status(404).send(e)
    }
  } catch (e) {
    return res.status(500).send(e)
  }
}
const getActivity = async (req, res) => {
  const noCounts = req.query.nocounts

  try {
    const act = await Activity
      .accessibleBy(req.ability, Action.READ)
      .findOne(req.params)
      .populate('owner', 'name nickname imgUrl')
      .populate('offerOrg', 'name imgUrl role')
      .lean()

    if (act === null) {
      return res.status(404).send()
    }
    if (!noCounts) {
      act.opCounts = await getOpsForActivity(act._id)
    }
    res.json(act)
  } catch (e) {
    res.status(404).send(e)
  }
}

const putActivity = async (req, res) => {
  const activityToUpdate = await Activity
    .accessibleBy(req.ability, Action.UPDATE)
    .findOne({ _id: req.params._id })

  if (activityToUpdate === null) {
    return res.status(403).send()
  }

  const { documents: docs } = req.body
  if (docs && Array.isArray(docs)) {
    for (const doc of docs) {
      if (!isValidFileUrl(doc.location)) {
        return res.status(400).send('Invalid document location URL')
      }
    }
  }
  await Activity.updateOne({ _id: req.params._id }, { $set: req.body })

  getActivity(req, res)
}

const createActivity = async (req, res) => {
  const personId = req.session.me._id.toString()
  const personRoles = req.session.me.role
  const orgAdminOrgs = req.session.me.orgAdminFor

  const canCreate = (
    personRoles.includes(Role.ADMIN) ||
    (
      personRoles.includes(Role.ORG_ADMIN) &&
      req.body.owner === personId &&
      orgAdminOrgs.includes(req.body.offerOrg)
    ) ||
    (
      personRoles.includes(Role.ACTIVITY_PROVIDER) &&
      req.body.owner === personId
    )
  )

  if (!canCreate) {
    return res.status(403).send()
  }

  const { documents: docs } = req.body
  if (docs && Array.isArray(docs)) {
    for (const doc of docs) {
      if (!isValidFileUrl(doc.location)) {
        return res.status(400).send('Invalid document location URL')
      }
    }
  }

  try {
    const activity = await Activity.create(req.body)
    res.status(200).send(activity)
  } catch (error) {
    console.error(error)
    res.status(500).send()
  }
}
function ensureSanitized (req, res, next) {
  const actDescriptionOptions = {
    allowedTags: ['a', 'b', 'br', 'caption', 'code', 'div', 'blockquote', 'em',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'iframe', 'img', 'li', 'ol',
      'p', 'pre', 's', 'span', 'strike', 'strong', 'table', 'tbody', 'td', 'th',
      'thead', 'tr', 'u', 'ul'],
    allowedAttributes: {
      a: ['href'],
      iframe: ['height', 'src', 'width'],
      img: ['src'],
      pre: ['spellcheck'],
      span: ['style']
    },
    allowedClasses: {
      '*': ['ql-align-center', 'ql-align-right', 'ql-align-justify', 'ql-syntax']
    },
    allowedStyles: {
      span: {
        // permits values for color and background-color CSS properties that look like 'rgb(230,0,50)'
        color: [/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
        backgroundColor: [/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/]
      }
    },
    allowedIframeHostnames: ['www.youtube.com'],
    // Should prevent any iframes using something other than https for their src.
    allowedSchemesByTag: { iframe: ['https'] },
    allowProtocolRelative: false
  }

  const act = req.body
  act.description = act.description && sanitizeHtml(act.description, actDescriptionOptions)
  req.body = act
  next()
}

module.exports = {
  ensureSanitized,
  listActivities,
  getActivity,
  putActivity,
  createActivity
}
