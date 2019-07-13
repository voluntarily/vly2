const opList = require('../../opportunity/__tests__/opportunity.fixture')
const archivedOpList = opList

for (let i = 0; i < archivedOpList.length; i++) {
  archivedOpList[i].status = 'completed'
}

module.exports = archivedOpList
