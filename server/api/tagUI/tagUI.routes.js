const {
  getAllTags,
  getAllTagAliasSets,
  getTagAliasSet,
  deleteTag,
  deleteTagAlias,
  editTag,
  addTag,
  addAliasToTag
} = require('./tagUI.controller')

module.exports = (server) => {
  server.get('/api/tagUI/allTags', getAllTags)
  server.get('/api/tagUI/allAliases', getAllTagAliasSets)
  server.get('/api/tagUI/getAliases/:tag', getTagAliasSet)
  server.delete('/api/tagUI/deleteTag/:tag', deleteTag)
  server.delete('/api/tagUI/deleteAlias/:tagA/:tagB', deleteTagAlias)
  server.put('/api/tagUI/editTag/:originalTag/:newTag', editTag)
  server.post('/api/tagUI/addTag/:tag', addTag)
  server.post('/api/tagUI/addAlias/:tagA/:tagB', addAliasToTag)
}
