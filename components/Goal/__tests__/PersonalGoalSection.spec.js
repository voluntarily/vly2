import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import goals from '../../../server/api/goal/__tests__/goal.fixture'
import { Provider } from 'react-redux'
import objectid from 'objectid'
import people from '../../../server/api/person/__tests__/person.fixture'
import configureStore from 'redux-mock-store'
import { PersonalGoalSection } from '../PersonalGoalSection'
import { PersonalGoalStatus } from '../../../server/api/personalGoal/personalGoal.constants'

test.before('Setup store', (t) => {
  people.forEach(p => { p._id = objectid().toString() })

  const alice = people[2]
  const personalGoals = [
    {
      person: alice._id,
      goal: goals[0],
      status: PersonalGoalStatus.QUEUED
    },
    {
      person: alice._id,
      goal: goals[1],
      status: PersonalGoalStatus.ACTIVE
    },
    {
      person: alice._id,
      goal: goals[2],
      status: PersonalGoalStatus.HIDDEN
    }
  ]

  t.context = {
    people,
    goals,
    personalGoals
  }

  t.context.mockStore = configureStore()(
    {
      personalGoals: {
        sync: true,
        syncing: false,
        loading: false,
        data: t.context.personalGoals,
        request: null
      }
    }
  )
})

test('mount the list with goals', t => {
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <PersonalGoalSection />
    </Provider>
  )
  t.is(wrapper.find('FormattedMessage').first().props().id, 'GoalSection.VP_NEW.title')
  t.is(wrapper.find('GoalList').length, 1)
  t.is(wrapper.find('GoalCard').length, 2)
})
