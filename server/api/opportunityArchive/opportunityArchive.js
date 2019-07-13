const mongoose = require('mongoose')
const Opportunity = require('../opportunity/opportunity')

module.exports = mongoose.model('OpportunityArchive', Opportunity.schema)
