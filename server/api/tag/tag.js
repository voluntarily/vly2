const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Enforce unique constraint on entries in tag table, case-insensitive
const tagSchema = new Schema({
  tag: String // "e.g C++"
})

module.exports = mongoose.model('Tag', tagSchema)
