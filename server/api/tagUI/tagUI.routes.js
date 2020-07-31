const {
  getAllTags,
  getAllTagAliasSets,
  getTagAliasSet,
  deleteTag,
  deleteTagAlias,
  editTag,
  editTagAlias,
  addTag,
  addTagToAliasSets,
  searchForTag,
  searchForTagAliasSet
} = require('./tagUI.controller')

module.exports = (server) => {
  server.get('/api/tagUI/allTags', getAllTags) 
  server.get('', getAllTagAliasSets)
  server.get('', getTagAliasSet)
  server.delete('', deleteTag)
  server.delete('', deleteTagAlias)
  server.put('', editTag)
  server.put('', editTagAlias)
  server.post('', addTag)
  server.post('', addTagToAliasSets)
  server.get('', searchForTag)
  server.get('', searchForTagAliasSet)
  //server.get('/api/statistics/activityTags/:orgId/:timeframe', getActivityTags)
}
