const {
  getAllTags,
  getAllTagAliasSets,
  getTagAliasSet,
  deleteTag,
  deleteTagAlias,
  editTag,
  addTag,
  addTagToAliasSets,
  searchForTag,
  searchForTagAliasSet
} = require('./tagUI.controller')

module.exports = (server) => {
  server.get('/api/tagUI/allTags', getAllTags)
  server.get('/api/tagUI/allAliases', getAllTagAliasSets)
  server.get('/api/tagUI/getAliases/:tag', getTagAliasSet)
  server.delete('/api/tagUI/deleteTag/:tag', deleteTag)
  server.delete('/api/tagUI/deleteAlias/:tagA/:tagB', deleteTagAlias)
  server.put('/api/tagUI/editTag/:originalTag/:newTag', editTag)
  server.post('', addTag)
  server.post('', addTagToAliasSets)
  server.get('', searchForTag)
  server.get('', searchForTagAliasSet)
}
