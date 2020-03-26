const Opportunity = require('../../../server/api/opportunity/opportunity')
const { OpportunityType, OpportunityStatus } = require('../../../server/api/opportunity/opportunity.constants')
const Person = require('../../../server/api/person/person')

export default async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  const opAskCount = await Opportunity.countDocuments({ status: OpportunityStatus.ACTIVE, type: OpportunityType.ASK })
  const opOfferCount = await Opportunity.countDocuments({ status: OpportunityStatus.ACTIVE, type: OpportunityType.OFFER })
  const personCount = await Person.countDocuments({ })

  const result = {
    Opportunity: { [OpportunityType.ASK]: opAskCount, [OpportunityType.OFFER]: opOfferCount },
    Person: personCount
  }
  res.send(result)
}
