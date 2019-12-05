import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import { GoalCardTest, GoalStatusIcon } from '../GoalCard'
import { PersonalGoalStatus } from '../../../server/api/personalGoal/personalGoal.constants'
import objectid from 'objectid'
import sinon from 'sinon'

const goal = {
  name: 'Test Goal Card',
  slug: 'goal-show-test-card',
  subtitle: 'Call to action - lets test things',
  description: `
  <div>
    <h1>Test Heading</h1>
    <p>Test paragraph with <strong>strong text</strong></p>
  </div>`,
  imgUrl: '/static/img/goals/teacherSetup.png',
  startLink: '/test',
  category: 'Test',
  evaluation: () => { console.log('Test Goal Card'); return false }
}

test('shallow GoalStatusIcon', t => {
  let wrapper = shallowWithIntl(
    <GoalStatusIcon status={PersonalGoalStatus.QUEUED} />
  )
  t.is(wrapper.text(), '')

  wrapper = shallowWithIntl(
    <GoalStatusIcon status={PersonalGoalStatus.ACTIVE} />
  )
  t.is(wrapper.find('GoalCard__StyledIconLeft').first().props().type, 'paper-clip')
  wrapper = shallowWithIntl(
    <GoalStatusIcon status={PersonalGoalStatus.COMPLETED} />
  )
  t.is(wrapper.find('GoalCard__StyledIconLeft').first().props().type, 'trophy')
})

test('shallow the card with goal', t => {
  const wrapper = shallowWithIntl(
    <GoalCardTest goal={goal} />
  )
  t.is(wrapper.find('GoalCard__CardTitle').first().text(), goal.name)
  t.is(wrapper.find('GoalCard__CardImage').first().props().src, goal.imgUrl)
})

test('shallow the card with a personalGoal', t => {
  const dispatch = sinon.spy()
  const goalID = objectid().toString()
  const personalGoal = {
    _id: objectid().toString(),
    person: objectid().toString(),
    goal: goalID,
    status: PersonalGoalStatus.QUEUED
  }
  const goal = {
    _id: goalID,
    name: 'Test Goal Card',
    slug: 'goal-show-test-card',
    subtitle: 'Call to action - lets test things',
    description: `
    <div>
      <h1>Test Heading</h1>
      <p>Test paragraph with <strong>strong text</strong></p>
    </div>`,
    imgUrl: '/static/img/goals/teacherSetup.png',
    startLink: '/test',
    category: 'Test',
    personalGoal,
    status: personalGoal.status,
    evaluation: () => { console.log('Test Goal Card'); return false }
  }

  let wrapper = shallowWithIntl(
    <GoalCardTest goal={goal} dispatch={dispatch} />
  )
  t.is(wrapper.find('GoalCard__CardTitle').first().text(), goal.name)
  t.is(wrapper.find('GoalCard__CardImage').first().props().src, goal.imgUrl)
  t.is(wrapper.find('GoalStatusIcon').first().props().status, PersonalGoalStatus.QUEUED)
  const closeBtn = wrapper.find('GoalCard__StyledIconRight').first()
  t.is(closeBtn.props().type, 'close-circle')
  const event = {
    stopPropagation: sinon.spy()
  }
  closeBtn.props().onClick(event) // handleClose
  wrapper.props().onClick(event) // handleClickCard

  // change state to HIDDEN - no card returned
  goal.status = PersonalGoalStatus.HIDDEN
  wrapper = shallowWithIntl(
    <GoalCardTest goal={goal} dispatch={dispatch} />
  )
  t.is(wrapper.text(), '')
})
