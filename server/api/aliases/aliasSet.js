const mongoose = require('mongoose')
const { DefaultAliasSet } = require('./aliases.constants')

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
  AliasSet = mongoose.model('AliasSet', aliasSetSchema, 'aliases') // Currently using aliases collection
}
module.exports = AliasSet
