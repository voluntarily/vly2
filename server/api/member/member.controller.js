import Member, { find as _find, accessibleBy } from './member'
import { getMemberbyId } from './member.lib'
import { Action } from '../../services/abilities/ability.constants'
import { TOPIC_MEMBER__UPDATE } from '../../services/pubsub/topic.constants'
import { publish } from 'pubsub-js'

/**
  api/members -> list all members
  api/members?org='orgid' -> lists all members associated with orgid.
  api/members?org='orgid'&me='personid' -> lists all members (hopefully only 0 or 1) associated with opid and personid.
  api/members?me='personid' -> list all the orgs i'm membered in and populate the org out.
 */
const listMembers = async (req, res) => {
  const sort = 'status'

  try {
    const find = {}
    const populateList = []

    if (req.query.orgid) {
      find.organisation = req.query.orgid
      populateList.push({ path: 'person', select: 'nickname name imgUrl role email phone sendEmailNotifications' })
      populateList.push({ path: 'organisation', select: 'name imgUrl groups role' })
    }

    if (req.query.meid) {
      find.person = req.query.meid
      populateList.push({ path: 'organisation', select: 'name imgUrl groups role' })
    }

    const query = _find(find)

    for (const populate of populateList) {
      query.populate(populate)
    }

    const members = await query
      .accessibleBy(req.ability, Action.LIST)
      .sort(sort)
      .exec()

    res.json(members)
  } catch (err) {
    res.status(404).send(err)
  }
}

const getMember = async (req, res) => {
  try {
    const member = await accessibleBy(req.ability, Action.READ)
      .findOne(req.params)

    if (member === null) {
      return res.status(404).send()
    }

    res.json(member)
  } catch (e) {
    res.status(500).send()
  }
}

const updateMember = async (req, res) => {
  try {
    const member = await accessibleBy(req.ability, Action.READ)
      .findOne(req.params)

    if (!member) {
      return res.sendStatus(404)
    }

    const updatedMember = Object.assign(member, req.body)

    if (!req.ability.can(Action.UPDATE, updatedMember)) {
      return res.sendStatus(404)
    }

    await updatedMember.save()
    const resMember = await getMemberbyId(member._id)
    publish(TOPIC_MEMBER__UPDATE, resMember)
    res.json(resMember)
  } catch (err) {
    res.status(500).send(err)
  }
}

const createMember = async (req, res) => {
  const memberData = req.body

  if (!memberData.person) {
    memberData.person = (req.session.me && req.session.me._id) ? req.session.me._id : undefined
  }

  const member = new Member(req.body)

  if (!req.ability.can(Action.CREATE, member)) {
    return res.sendStatus(403)
  }

  try {
    await member.save()

    const createdMember = await getMemberbyId(member._id)
    publish(TOPIC_MEMBER__UPDATE, createdMember)
    res.json(createdMember)
  } catch (error) {
    return res.sendStatus(500)
  }
}

export default {
  listMembers,
  getMember,
  updateMember,
  createMember
}
