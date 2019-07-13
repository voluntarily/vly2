const { Action } = require('../../services/abilities/ability.constants')
const { PersonRoutes } = require('./person.constants')
const pick = require('lodash.pick')

const { convertRequestToAction } = require('../opportunity/opportunity.authorize')

const authorizePersonActions = (req, res, next) => {
    const action = convertRequestToAction(req)
    const authorize = req.ability.can(action, Subject) 
    console.log(authorize)
    if (authorized) {
        next()
    } else {
        res.status(403).end()
    }
}

// const authorizeOpportunityFields = (req, res, next) => {
//     let authorizedFields = Person.accessibleFieldsBy(req.ability)
//     res.data = Array.is(res.body)
//         ? res.body.map()
// }

module.exports = {
    authorizePersonActions
}