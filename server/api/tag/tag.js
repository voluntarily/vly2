const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Enforce unique constraint on entries in tag table, case-insensitive
const tagSchema = new Schema({
  tag: { type: String, lowercase: true, trim: true } // "e.g C++"
})

module.exports = tagSchema
