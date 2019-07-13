const opList = require('../../opportunity/__tests__/opportunity.fixture')
const opportunityArchiveList = opList

for (let i = 0; i < opportunityArchiveList.length; i++) {
  opportunityArchiveList[i].status = 'completed'
}

module.exports = opportunityArchiveList
