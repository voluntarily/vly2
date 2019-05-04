const mongoose = require('mongoose')
const Schema = mongoose.Schema

const interestSchema = new Schema({
    personId: {type: 'String', required: true},
    opportunityId: {type: 'String', required: true},
    comment: String
})

module.exports = mongoose.model('Interest', interestSchema)