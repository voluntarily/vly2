import test from 'ava'
import { PersonalGoalStatus } from '../personalGoal.constants'
import {
  GoalTests
} from '../personalGoal.lib'

import { startMongo, stopMongo } from '../../../util/mockMongo'
import Goal from '../../goal/goal'
import goals from '../../goal/__tests__/goal.fixture'
import Activity from '../../activity/activity'
import Opportunity from '../../opportunity/opportunity'
import Organisation from '../../organisation/organisation'
import orgs from '../../organisation/__tests__/organisation.fixture'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import { addMember } from '../../member/member.lib'
import { MemberStatus } from '../../member/member.constants'
import { OpportunityStatus } from '../../opportunity/opportunity.constants'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
  t.context.orgs = await Organisation.create(orgs).catch((err) => `Unable to create organisations: ${err}`)
  t.context.org = t.context.orgs[0]
  t.context.goals = await Goal.create(goals).catch((err) => `Unable to create goals: ${err}`)
  t.context.goal = t.context.goals[0]
  t.context.andrew = t.context.people[0]
  t.context.dali = t.context.people[1]
  t.context.alice = t.context.people[2]
})

test.serial('GoalTests - orgCompleteness', async t => {
  // make alice a member of OMGTech so thats her OP org
  const aliceMember = await addMember({
    person: t.context.alice._id,
    organisation: t.context.orgs[1]._id, // omgtech is an op
    validation: 'test Member',
    status: MemberStatus.MEMBER
  })
  const personalGoalAlice = {
    person: t.context.alice._id, // the only bit that counts here
    goal: t.context.goals[1]._id, // this returns true evaluation
    status: PersonalGoalStatus.ACTIVE
  }
  t.deepEqual(await GoalTests.orgCompleteness(personalGoalAlice, 'op'), { count: 10, score: 7 })
  await aliceMember.deleteOne()
})

test.serial('GoalTests - activityStarted', async t => {
  // make alice a member of OMGTech so thats her OP org
  const aliceMember = await addMember({
    person: t.context.alice._id,
    organisation: t.context.orgs[1]._id, // omgtech is an op
    validation: 'test Member',
    status: MemberStatus.MEMBER
  })
  // create an activity
  const testAct = new Activity({
    name: 'Fake Activity',
    slug: 'fake-activity',
    subtitle: 'up',
    imgUrl: 'https://images.sunlive.co.nz/images/170705-st-marys-school-rockets1.jpg',
    description: '',
    duration: '4 hours',
    status: 'active',
    offerOrg: t.context.orgs[0]._id
  })
  const act = await testAct.save()
  // create a fake opportunity based on the target act
  const testOp = new Opportunity({
    name: 'Test Op',
    imgUrl: 'https://images.sunlive.co.nz/images/170705-st-marys-school-rockets1.jpg',
    duration: '1 day',
    location: 'Auckland',
    status: OpportunityStatus.ACTIVE,
    requestor: t.context.alice._id,
    tags: [],
    date: [
      null,
      null
    ],
    offerOrg: t.context.orgs[1]._id,
    fromActivity: act._id
  })
  await testOp.save()
  const personalGoalAlice = {
    person: t.context.alice // the only bit that counts here
  }
  t.is(await GoalTests.activityStarted(personalGoalAlice, 'null-activity'), false)
  t.is(await GoalTests.activityStarted(personalGoalAlice, 'fake-activity'), true)
  await aliceMember.deleteOne()
})
