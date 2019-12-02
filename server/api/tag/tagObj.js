/* Deprecated - This is the old tag collection where each item is a single word.
   we keep it around so we can convert older databases to new ones.
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Enforce unique constraint on entries in tag table, case-insensitive
const tagObjSchema = new Schema({
  tag: { type: String, lowercase: true, unique: true, required: true } // "e.g C++"
})

module.exports = mongoose.model('Tag', tagObjSchema)
