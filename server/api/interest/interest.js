const mongoose = require('mongoose')
const Schema = mongoose.Schema
const idvalidator = require('mongoose-id-validator');

const interestSchema = new Schema({
    person: {type: Schema.Types.ObjectId, ref: 'Person', required: true},
    opportunity: {type: Schema.Types.ObjectId, ref: 'Opportunity', required: true},
    comment: String
})

interestSchema.plugin(idvalidator);
module.exports = mongoose.model('Interest', interestSchema)