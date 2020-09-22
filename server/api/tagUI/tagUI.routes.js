const {
  getAllTagAliasSets,
  getTagAliasSet,
  deleteTag,
  deleteTagAlias,
  editTag,
  addTag,
  addAliasToTag
} = require('./tagUI.controller')

module.exports = (server) => {
  server.get('/api/tagUI', getAllTagAliasSets)
  server.get('/api/tagUI/:tag', getTagAliasSet)
  server.delete('/api/tagUI/tag/:tag', deleteTag)
  server.delete('/api/tagUI/alias/:tag', deleteTagAlias) // body must contain "aliasToDelete" entry
  server.put('/api/tagUI/tag/:tag', editTag) // body must contain "edittedTag" entry
  server.post('/api/tagUI/tag/:tag', addTag)
  server.post('/api/tagUI/alias/:tag', addAliasToTag) // body must contain "aliasToAdd" entry
}
