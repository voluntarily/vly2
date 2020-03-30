const mongoose = require('mongoose')
const { config } = require('../../../config/serverConfig')
const Organisation = require('../../../server/api/organisation/organisation')
const { OrganisationRole } = require('../../../server/api/organisation/organisation.constants')
const Person = require('../../../server/api/person/person')
const Member = require('../../../server/api/member/member')
const { MemberStatus } = require('../../../server/api/member/member.constants')
const { OpportunityStatus } = require('../../../server/api/opportunity/opportunity.constants')
const ArchivedOpportunity = require('../../../server/api/archivedOpportunity/archivedOpportunity')

async function main () {
  mongoose.Promise = Promise

  if (process.env.NODE_ENV !== 'development') {
    console.log('This script can only be run in development')
    process.exit(1)
  }

  try {
    await mongoose.connect(
      config.databaseUrl,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      }
    )
  } catch (error) {
    console.log(error)
    process.exit(1)
  }

  if (!process.argv[2]) {
    console.log('Provide an email for the person to link to the organisation')
    console.log('Usage: node x/db/scenarios/opportunity-history.js test@example.com')
    process.exit(1)
  }

  const person = await Person.findOne({ email: process.argv[2] })

  if (person === null) {
    console.log(`Could not find person for email: ${process.argv[2]}`)
    process.exit(1)
  }

  const organisationWithHistoryData = {
    name: 'Organisation with history',
    slug: 'organisation-with-history',
    role: [OrganisationRole.OPPORTUNITY_PROVIDER]
  }

  const organisation = await Organisation.findOneAndUpdate(
    organisationWithHistoryData,
    {
      $set: organisationWithHistoryData
    },
    { upsert: true, new: true }
  )

  const memberData = {
    person: person._id,
    organisation: organisation._id,
    status: MemberStatus.MEMBER
  }

  await Member.findOneAndUpdate(
    memberData,
    {
      $set: memberData
    },
    { upsert: true }
  )

  const archivedOpportunities = [{
    name: 'Opportunity 1',
    status: OpportunityStatus.COMPLETED,
    requestor: person,
    offerOrg: organisation
  }, {
    name: 'Opportunity 2',
    status: OpportunityStatus.COMPLETED,
    requestor: person,
    offerOrg: organisation
  }, {
    name: 'Opportunity 3',
    status: OpportunityStatus.CANCELLED,
    requestor: person,
    offerOrg: organisation
  }, {
    name: 'Opportunity 4',
    status: OpportunityStatus.COMPLETED,
    requestor: person,
    offerOrg: organisation
  }, {
    name: 'Opportunity 5',
    status: OpportunityStatus.COMPLETED,
    requestor: person,
    offerOrg: organisation
  }, {
    name: 'Opportunity 6',
    status: OpportunityStatus.COMPLETED,
    requestor: person,
    offerOrg: organisation
  }, {
    name: 'Opportunity 7',
    status: OpportunityStatus.COMPLETED,
    requestor: person,
    offerOrg: organisation
  }, {
    name: 'Opportunity 8',
    status: OpportunityStatus.COMPLETED,
    requestor: person,
    offerOrg: organisation
  }, {
    name: 'Opportunity 9',
    status: OpportunityStatus.COMPLETED,
    requestor: person,
    offerOrg: organisation
  }, {
    name: 'Opportunity 10',
    status: OpportunityStatus.COMPLETED,
    requestor: person,
    offerOrg: organisation
  }]

  await ArchivedOpportunity.deleteMany({
    offerOrg: organisation
  })

  await ArchivedOpportunity.create(archivedOpportunities)

  console.log('Done')
  await mongoose.disconnect()
  process.exit(0)
}

main()
