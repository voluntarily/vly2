const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tagSchema = {
  tags: [{ type: String, lowercase: true, unique: true }]
}

// Enforce unique constraint on entries in tag table, case-insensitive
// const tagSchema = new Schema({
//   tag: { type: String, lowercase: true, unique: true, required: true } // "e.g C++"
// })

module.exports = mongoose.model('TagList', tagSchema)
