const opList = require('../../opportunity/__tests__/opportunity.fixture')
const archivedOpportunityList = opList

for (let i = 0; i < archivedOpportunityList.length; i++) {
  archivedOpportunityList[i].status = 'completed'
}

module.exports = archivedOpportunityList
