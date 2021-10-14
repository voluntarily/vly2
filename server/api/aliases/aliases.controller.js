const AliasSet = require('./aliasSet')
const { Role } = require('../../services/authorize/role')
const { editATag, deleteATag } = require('./../tag/tag.controller')
const { initializeTags } = require('./../../util/initTags')

// These API calls allow users to add, get, edit and delete tags to/from the "alias" collection in the
// vly2 database. There are also calls to add, get, edit and delete tags in the alias list of another tag.
// The API doesn't currently make changes to the "tag" collection in the vly2 database.
// TODO: Sync tags in "alias2" collection with those in "tag" collection (possibly combine collections?)

/**
 * Get all tags and their aliases in the alias collection
 * @param req
 * @param res
 * @returns void
 */
const getAllTagAliasSets = async (req, res) => {
  let query = {}
  let sort = 'tag'
  let select = null

  try {
    query = req.query.q ? JSON.parse(req.query.q) : query
    sort = req.query.s ? JSON.parse(req.query.s) : sort
    select = req.query.p ? req.query.p : null
  } catch (e) {
    // if there is something wrong with the query return a Bad Query
    return res.status(400).send(e)
  }

  try {
    const got = await AliasSet.find(query, select).sort(sort).exec()
    res.json(got)
  } catch (e) {
    // If we can't find a match return 404
    res.status(404).send(e)
  }
}

/**
 * Get a tag and its aliases from the alias collection
 * @param req
 * @param res
 * @returns void
 */
const getTagAliasSet = async (req, res) => {
  try {
    const { tag } = req.params

    if (!(await AliasSet.exists({ tag: tag }))) {
      return res.status(404).send({ error: 'Tag not found' })
    }

    const tagWithAliasSet = await AliasSet
      .findOne({ tag })

    res.json(tagWithAliasSet)
  } catch (e) {
    res.status(500).send({ error: e })
  }
}

/**
 * Delete a tag from the alias collection, and delete it from other alias lists
 * @param req
 * @param res
 * @returns void
 */
const deleteTag = async (req, res) => {
  const personRoles = req.session.me.role

  const adminRole = personRoles.includes(Role.ADMIN)

  if (!adminRole) {
    return res.status(403).send({ error: 'User does not have permission to perform this action' })
  }

  try {
    const tagToDelete = req.params.tag

    if (!(await AliasSet.exists({ tag: tagToDelete }))) {
      return res.status(404).send({ error: 'Tag not found' })
    }

    // Delete tag from the aliases set of other tags
    const tagToDeleteWithAliases = await AliasSet
      .findOne({ tag: tagToDelete })

    const tagToDeleteAliases = tagToDeleteWithAliases.aliases
    if (tagToDeleteAliases.length === 0) {
      // tag has no aliases in the system
    } else {
      for (const tag of tagToDeleteAliases) {
        const tagWithAliases = await AliasSet
          .findOne({ tag })

        if (tagWithAliases === null) {
          return res.status(404).send({ error: 'An alias is not found as a tag' })
        }

        const otherAliases = tagWithAliases.aliases // List of aliases of which the tag to delete is a part of

        const index = otherAliases.indexOf(tagToDelete)
        if (index > -1) {
          otherAliases.splice(index, 1)
        }

        // Remove the tag from alias collection
        await AliasSet.updateOne({ tag: tagWithAliases.tag }, { aliases: otherAliases })
      }
    }

    // Delete tag from alias collection
    await AliasSet.findOne({ tag: tagToDelete }).then(item => item.deleteOne()
      .catch(err => res.status(404).json({ success: false }).send({ error: err })))

    // Delete the tag in the taglist collection
    await deleteATag(req, res)
      .catch(err => res.status(404).json({ success: false }).send({ error: err }))
  } catch (e) {
    res.status(500).send({ error: e })
  }
}

/**
 * Delete a tag from an alias set (ie remove tag A from the alias set of tag B)
 * @param req
 * @param res
 * @returns void
 */
const deleteTagAlias = async (req, res) => {
  // The alias relationships are bidirectional, so if tag A is removed from the alias list of tag B,
  // then we must also remove tag B from the alias list of tag A
  const personRoles = req.session.me.role

  const adminRole = personRoles.includes(Role.ADMIN)

  if (!adminRole) {
    return res.status(403).send({ error: 'User does not have permission to perform this action' })
  }

  try {
    // var tag = [req.params.tagA, req.params.tagB]
    // var aliastoDelete = [req.params.tagB, req.params.tagA]

    const tag = [req.params.tag, req.body.aliasToDelete]
    const aliastoDelete = [req.body.aliasToDelete, req.params.tag]

    let i
    for (i = 0; i < tag.length; i++) {
      if (!(await AliasSet.exists({ tag: tag[i] }))) {
        return res.status(404).send({ error: 'Tag not found' })
      }

      const tagWithAliases = await AliasSet
        .findOne({ tag: tag[i] })

      const aliases = tagWithAliases.aliases // List of aliases of which the tag to delete is a part of

      const index = aliases.indexOf(aliastoDelete[i])
      if (index > -1) {
        aliases.splice(index, 1)
      } else {
        return res.status(404).send({ error: 'Alias is not found' })
      }

      // Remove the tag from alias collection
      await AliasSet.updateOne({ tag: tag[i] }, { aliases: aliases })
    }
    return res.json({ success: true })
  } catch (e) {
    res.status(500).send({ error: e })
  }
}

/**
 * Edit a tag from the alias collection, and update other alias lists with editted version
 * @param req
 * @param res
 * @returns void
 */
const editTag = async (req, res) => {
  const personRoles = req.session.me.role

  const adminRole = personRoles.includes(Role.ADMIN)

  if (!adminRole) {
    return res.status(403).send({ error: 'User does not have permission to perform this action' })
  }

  try {
    const originalTag = req.params.tag
    const newTag = req.body.edittedTag

    if (!(await AliasSet.exists({ tag: originalTag }))) {
      return res.status(404).send({ error: 'Tag not found' })
    }

    // Update the tag in the aliases set of other tags
    const tagToEditWithAliases = await AliasSet
      .findOne({ tag: originalTag })

    const tagToEditAliases = tagToEditWithAliases.aliases
    if (tagToEditAliases.length === 0) {
      // tag has no aliases in the system
    } else {
      for (const tag of tagToEditAliases) {
        const tagWithAliases = await AliasSet
          .findOne({ tag })

        if (tagWithAliases === null) {
          return res.status(404).send({ error: 'An alias is not found as a tag' })
        }

        const otherAliases = tagWithAliases.aliases // List of aliases of which the tag to edit is a part of

        const index = otherAliases.indexOf(originalTag)
        if (index > -1) {
          otherAliases[index] = newTag
        }

        // Update the tag in the alias collection
        await AliasSet.updateOne({ tag: tagWithAliases.tag }, { aliases: otherAliases })
      }
    }

    // Edit the tag in the alias collection
    await AliasSet.updateOne({ _id: tagToEditWithAliases._id }, { tag: newTag })
      .catch(err => res.status(404).json({ success: false }).send({ error: err }))

    // Edit the tag in the taglist collection
    await editATag(req, res)
      .catch(err => res.status(404).json({ success: false }).send({ error: err }))
  } catch (e) {
    res.status(500).send({ error: e })
  }
}

const addTag = async (req, res) => {
  const personRoles = req.session.me.role

  const adminRole = personRoles.includes(Role.ADMIN)

  if (!adminRole) {
    return res.status(403).send({ error: 'User does not have permission to perform this action' })
  }

  try {
    const newTag = req.params.tag
    if (await AliasSet.exists({ tag: newTag })) {
      return res.status(404).send({ error: 'Tag is already in database' })
    }

    const aliasSet = await AliasSet.create({
      tag: newTag,
      aliases: []
    })

    const next = () => {}

    initializeTags(req, res, next)
      .catch(err => res.status(404).json({ success: false }).send({ error: err }))

    res.status(200).send(aliasSet)
  } catch (e) {
    console.log(e)
    res.status(500).send({ error: e })
  }
}

const addAliasToTag = async (req, res) => {
  // An alias can ber a new tag to the collection or be an existing tag
  // The alias relationships are bidirectional, so if tag A is added to the alias list of tag B,
  // then we must also add tag B from the alias list of tag A
  const personRoles = req.session.me.role

  const adminRole = personRoles.includes(Role.ADMIN)

  if (!adminRole) {
    return res.status(403).send({ error: 'User does not have permission to perform this action' })
  }

  try {
    const tag = [req.params.tag, req.body.aliasToAdd]
    const aliastoAdd = [req.body.aliasToAdd, req.params.tag]

    let i
    for (i = 0; i < tag.length; i++) {
      if (!(await AliasSet.exists({ tag: tag[i] }))) {
        return res.status(404).send({ error: 'Tag not found' })
      }

      const tagWithAliases = await AliasSet
        .findOne({ tag: tag[i] })

      const aliases = tagWithAliases.aliases // List of aliases of which the new alias will be added to

      const index = aliases.indexOf(aliastoAdd[i])
      if (index > -1) {
        return res.status(404).send({ error: 'Alias is already added to tag' })
      }

      if (!(await AliasSet.exists({ tag: aliastoAdd[i] }))) {
        // Alias is new to collection
        await AliasSet.create({
          tag: aliastoAdd[i],
          aliases: []
        })

        const next = () => {}

        initializeTags(req, res, next)
          .catch(err => res.status(404).json({ success: false }).send({ error: err }))
      }
      // Add the alias to alias collection
      aliases.push(aliastoAdd[i])

      await AliasSet.updateOne({ tag: tag[i] }, { aliases: aliases })
    }

    return res.json({ success: true })
  } catch (e) {
    res.status(500).send({ error: e })
  }
}

module.exports = {
  getAllTagAliasSets,
  getTagAliasSet,
  deleteTag,
  deleteTagAlias,
  editTag,
  addTag,
  addAliasToTag
}
