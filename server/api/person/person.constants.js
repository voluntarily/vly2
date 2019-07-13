const { Action } = require('../../services/abilities/ability.constants')

const SchemaName = 'Person'

const PersonRoutes = {
    [Action.LIST]: '/api/people',
    [Action.READ]: '/api/people/:id',
    [Action.UPDATE]: '/api/people/:id',
    [Action.CREATE]: '/api/people'
}

module.exports =  {
    SchemaName,
    PersonRoutes
}