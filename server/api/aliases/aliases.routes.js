const {
  getAllTagAliasSets,
  getTagAliasSet,
  deleteTag,
  deleteTagAlias,
  editTag,
  addTag,
  addAliasToTag
} = require('./aliases.controller')

module.exports = (server) => {
  server.get('/api/aliases', getAllTagAliasSets)
  server.get('/api/aliases/:tag', getTagAliasSet)
  server.delete('/api/aliases/tag/:tag', deleteTag)
  server.delete('/api/aliases/alias/:tag', deleteTagAlias) // body must contain "aliasToDelete" entry
  server.put('/api/aliases/tag/:tag', editTag) // body must contain "edittedTag" entry
  server.post('/api/aliases/tag/:tag', addTag)
  server.post('/api/aliases/alias/:tag', addAliasToTag) // body must contain "aliasToAdd" entry
}
