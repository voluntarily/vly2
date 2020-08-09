const mongoose = require('mongoose')
const { DefaultAliasSet } = require('./tagUI.constants')

const aliasSetSchema = {
  tag: { type: String, lowercase: true, unique: true, default: DefaultAliasSet },
  aliases: [
    { type: String, lowercase: true, unique: false }
  ]
}

var AliasSet

if (mongoose.models.AliasSet) {
  AliasSet = mongoose.model('AliasSet')
} else {
  AliasSet = mongoose.model('AliasSet', aliasSetSchema, 'aliases2') // Currently using aliases2
}
module.exports = AliasSet

// module.exports = mongoose.model(SchemaName, aliasSetSchema, 'aliases')
